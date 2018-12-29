#pragma once

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "CaptionThis-Swift.h"

@interface SpeechBridgeModule : RCTEventEmitter<RCTBridgeModule, SpeechManagerDelegate>
-(void)speechManagerDidReceiveSpeechTranscription:(SFTranscription *)transcription;
-(void)speechManagerDidBecomeAvailable;
-(void)speechManagerDidBecomeUnavailable;
@end
