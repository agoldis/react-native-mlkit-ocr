#import "MlkitOcr.h"

#import <React/RCTBridge.h>
#import <React/RCTLog.h>

#import <GoogleMLKit/MLKit.h>

@implementation MlkitOcr

RCT_EXPORT_MODULE()

static NSString *const detectionNoResultsMessage = @"Something went wrong";

NSMutableArray* prepareOutput(MLKText *result) {
    NSMutableArray *output = [NSMutableArray array];
    for (MLKTextBlock *block in result.blocks) {
        
        NSMutableArray *blockElements = [NSMutableArray array];
        for (MLKTextLine *line in block.lines) {
            NSMutableArray *lineElements = [NSMutableArray array];
            for (MLKTextElement *element in line.elements) {
                NSMutableDictionary *e = [NSMutableDictionary dictionary];
                e[@"text"] = element.text;
                e[@"cornerPoints"] = element.cornerPoints;
                e[@"bounding"] = @{
                                   @"top": @(element.frame.origin.y),
                                   @"left": @(element.frame.origin.x),
                                   @"width": @(element.frame.size.width),
                                   @"height": @(element.frame.size.height)
                                   };
                [lineElements addObject:e];
            }
            
            NSMutableDictionary *l = [NSMutableDictionary dictionary];
            l[@"text"] = line.text;
            l[@"cornerPoints"] = line.cornerPoints;
            l[@"elements"] = lineElements;
            l[@"bounding"] = @{
                               @"top": @(line.frame.origin.y),
                               @"left": @(line.frame.origin.x),
                               @"width": @(line.frame.size.width),
                               @"height": @(line.frame.size.height)
                               };
            [blockElements addObject:l];
        }
        
        NSMutableDictionary *b = [NSMutableDictionary dictionary];
        b[@"text"] = block.text;
        b[@"cornerPoints"] = block.cornerPoints;
        b[@"bounding"] = @{
                           @"top": @(block.frame.origin.y),
                           @"left": @(block.frame.origin.x),
                           @"width": @(block.frame.size.width),
                           @"height": @(block.frame.size.height)
                           };
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
