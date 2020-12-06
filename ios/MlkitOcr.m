#import "MlkitOcr.h"

#import <React/RCTBridge.h>
#import <React/RCTLog.h>

#import <CoreGraphics/CoreGraphics.h>
#import <GoogleMLKit/MLKit.h>

@implementation MlkitOcr

RCT_EXPORT_MODULE()

static NSString *const detectionNoResultsMessage = @"Something went wrong";



NSMutableArray* getCornerPoints(NSArray *cornerPoints) {
    NSMutableArray *result = [NSMutableArray array];
    
    if (cornerPoints == nil) {
        return result;
    }
    for (NSValue  *point in cornerPoints) {
        NSMutableDictionary *resultPoint = [NSMutableDictionary dictionary];
        [resultPoint setObject:[NSNumber numberWithFloat:point.CGPointValue.x] forKey:@"x"];
        [resultPoint setObject:[NSNumber numberWithFloat:point.CGPointValue.y] forKey:@"y"];
        [result addObject:resultPoint];
    }
    return result;
}


NSDictionary* getBounding(CGRect frame) {
    return @{
       @"top": @(frame.origin.y),
       @"left": @(frame.origin.x),
       @"width": @(frame.size.width),
       @"height": @(frame.size.height)
   };
}


NSMutableArray* prepareOutput(MLKText *result) {
    NSMutableArray *output = [NSMutableArray array];
    for (MLKTextBlock *block in result.blocks) {
        
        NSMutableArray *blockElements = [NSMutableArray array];
        for (MLKTextLine *line in block.lines) {
            NSMutableArray *lineElements = [NSMutableArray array];
            for (MLKTextElement *element in line.elements) {
                NSMutableDictionary *e = [NSMutableDictionary dictionary];
                e[@"text"] = element.text;
                e[@"cornerPoints"] = getCornerPoints(element.cornerPoints);
                e[@"bounding"] = getBounding(element.frame);
                [lineElements addObject:e];
            }
            
            NSMutableDictionary *l = [NSMutableDictionary dictionary];
            l[@"text"] = line.text;
            l[@"cornerPoints"] = getCornerPoints(line.cornerPoints);
            l[@"elements"] = lineElements;
            l[@"bounding"] = getBounding(line.frame);
            [blockElements addObject:l];
        }
        
        NSMutableDictionary *b = [NSMutableDictionary dictionary];
        b[@"text"] = block.text;
        b[@"cornerPoints"] = getCornerPoints(block.cornerPoints);
        b[@"bounding"] = getBounding(block.frame);
        b[@"lines"] = blockElements;
        [output addObject:b];
    }
    return output;
}


RCT_REMAP_METHOD(detectFromUri, detectFromUri:(NSString *)imagePath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (!imagePath) {
        RCTLog(@"No image uri provided");
        reject(@"wrong_arguments", @"No image uri provided", nil);
        return;
    }
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSData *imageData = [NSData dataWithContentsOfURL:[NSURL URLWithString:imagePath]];
        UIImage *image = [UIImage imageWithData:imageData];
        
        if (!image) {
            dispatch_async(dispatch_get_main_queue(), ^{
                RCTLog(@"No image found %@", imagePath);
                reject(@"no_image", @"No image path provided", nil);
            });
            return;
        }
        
        MLKTextRecognizer *textRecognizer = [MLKTextRecognizer textRecognizer];
        MLKVisionImage *handler = [[MLKVisionImage alloc] initWithImage:image];
        
        [textRecognizer processImage:handler completion:^(MLKText  *_Nullable result, NSError *_Nullable error) {
            @try {
                if (error != nil || result == nil) {
                    NSString *errorString = error ? error.localizedDescription : detectionNoResultsMessage;
                    @throw [NSException exceptionWithName:@"failure" reason:errorString userInfo:nil];
                    return;
                }
                NSMutableArray *output = prepareOutput(result);
                dispatch_async(dispatch_get_main_queue(), ^{
                    resolve(output);
                });
            }
            @catch (NSException *e) {
                NSString *errorString = e ? e.reason : detectionNoResultsMessage;
                NSDictionary *pData = @{
                                        @"error": [NSMutableString stringWithFormat:@"On-Device text detection failed with error: %@", errorString],
                                        };
                dispatch_async(dispatch_get_main_queue(), ^{
                    resolve(pData);
                });
            }
            
        }];
        
    });
    
}

RCT_REMAP_METHOD(detectFromFile, detectFromFile:(NSString *)imagePath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (!imagePath) {
        reject(@"wrong_arguments", @"No image path provided", nil);
        return;
    }
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSData *imageData = [NSData dataWithContentsOfFile:imagePath];
        UIImage *image = [UIImage imageWithData:imageData];
        
        if (!image) {
            dispatch_async(dispatch_get_main_queue(), ^{
                reject(@"no_image", @"No image path provided", nil);
            });
            return;
        }
        
        MLKTextRecognizer *textRecognizer = [MLKTextRecognizer textRecognizer];
        MLKVisionImage *handler = [[MLKVisionImage alloc] initWithImage:image];
        
        [textRecognizer processImage:handler completion:^(MLKText *_Nullable result, NSError *_Nullable error) {
            @try {
                if (error != nil || result == nil) {
                    NSString *errorString = error ? error.localizedDescription : detectionNoResultsMessage;
                    @throw [NSException exceptionWithName:@"failure" reason:errorString userInfo:nil];
                    return;
                }
            
                NSMutableArray *output = prepareOutput(result);
                dispatch_async(dispatch_get_main_queue(), ^{
                    resolve(output);
                });
            }
            @catch (NSException *e) {
                NSString *errorString = e ? e.reason : detectionNoResultsMessage;
                NSDictionary *pData = @{
                                        @"error": [NSMutableString stringWithFormat:@"On-Device text detection failed with error: %@", errorString],
                                        };
                dispatch_async(dispatch_get_main_queue(), ^{
                    resolve(pData);
                });
            }
            
        }];
    });
    
}


@end
