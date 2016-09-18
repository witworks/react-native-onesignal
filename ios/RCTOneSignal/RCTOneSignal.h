#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"

@interface RNOneSignal : RCTEventEmitter <RCTBridgeModule>

- (id)initWithLaunchOptions:(NSDictionary *)launchOptions appId:(NSString *)appId;
- (id)initWithLaunchOptions:(NSDictionary *)launchOptions appId:(NSString *)appId settings:(NSDictionary*)settings;

@end
