#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface SpeechBridgeModule
    : RCTEventEmitter <RCTBridgeModule, SpeechManagerDelegate>
- (void)speechManagerDidReceiveSpeechTranscriptionWithIsFinal:(BOOL)isFinal
                                                transcription:
                                                    (SpeechTranscription *)
                                                        transcription;
- (void)speechManagerDidBecomeAvailable;
- (void)speechManagerDidBecomeUnavailable;
- (void)speechManagerDidNotDetectSpeech;
- (void)speechManagerDidTerminate;
@end
