#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface SpeechBridgeModule
    : RCTEventEmitter <RCTBridgeModule, SpeechManagerDelegate>
- (void)speechManagerDidReceiveSpeechTranscriptionWithIsFinal:(BOOL)isFinal
                                                transcription:
                                                    (SFTranscription *)
                                                        transcription;
- (void)speechManagerDidBecomeAvailable;
- (void)speechManagerDidBecomeUnavailable;
- (void)speechManagerDidNotDetectSpeech;
@end
