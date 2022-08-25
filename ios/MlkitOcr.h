#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import "MlkitOcrSpec.h"
@interface MlkitOcr : NSObject <MlkitOcrSpec>
@end

#else

@interface MlkitOcr : NSObject <RCTBridgeModule>
@end

#endif
