#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"

@interface RCTOneSignal : RCTEventEmitter

- (id)initWithLaunchOptions:(NSDictionary *)launchOptions appId:(NSString *)appId;
- (id)initWithLaunchOptions:(NSDictionary *)launchOptions appId:(NSString *)appId settings:(NSDictionary*)settings;
+ (void)didReceiveRemoteNotification:(NSDictionary *)dictionary;
@end
