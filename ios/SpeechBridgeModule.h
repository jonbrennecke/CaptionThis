#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface SpeechBridgeModule
    : RCTEventEmitter <RCTBridgeModule, SpeechManagerDelegate>
- (void)speechManagerDidReceiveSpeechTranscription:
    (SFTranscription *)transcription;
- (void)speechManagerDidBecomeAvailable;
- (void)speechManagerDidBecomeUnavailable;
@end
