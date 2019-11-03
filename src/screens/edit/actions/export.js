// @flow
import VideoExportManager from '../../../utils/VideoExportManager';
import * as Debug from '../../../utils/Debug';
import { logSpeechTranscriptionAnalytics } from './analytics';

import type { SpeechTranscription } from '@jonbrennecke/react-native-speech';

import type { VideoID, Size, Orientation } from '../../../types/media';
import type { CaptionStyleObject } from '../../../types/video';
import type { EmitterSubscription } from '../../../types/react';

let exportDidFinishListener: ?EmitterSubscription = null;
let exportDidFailListener: ?EmitterSubscription = null;
let exportDidUpdateProgressListener: ?EmitterSubscription = null;

type ExportVideoParams = {
  speechTranscription: ?SpeechTranscription,
  videoID: VideoID,
  videoViewSize: Size,
  duration: number,
  orientation: ?Orientation,
  captionStyle: CaptionStyleObject,
  onExportDidFail: () => void,
  onExportDidFinish: () => void,
  onExportDidUpdateProgress: (progress: number) => void,
};

export const exportVideo = async ({
  speechTranscription,
  videoID,
  videoViewSize,
  duration,
  orientation,
  captionStyle,
  onExportDidFail,
  onExportDidFinish,
  onExportDidUpdateProgress,
}: ExportVideoParams) => {
  const textSegments = speechTranscription
    ? speechTranscription.segments.map(segment => ({
        duration: segment.duration,
        timestamp: segment.timestamp,
        text: segment.substring,
      }))
    : [];
  try {
    addExportListeners({
      onExportDidFail: () => {
        removeExportListeners();
        onExportDidFail();
      },
      onExportDidFinish: () => {
        removeExportListeners();
        onExportDidFinish();
      },
      onExportDidUpdateProgress,
    });

    /// MARK - Save audio file
    if (speechTranscription) {
      // only send short audio files
      if (duration < 200) {
        await logSpeechTranscriptionAnalytics(videoID, speechTranscription);
      }
    }

    await VideoExportManager.exportVideo({
      video: videoID,
      viewSize: videoViewSize,
      duration: duration,
      orientation: orientation || 'up',
      captionStyle: captionStyle,
      textSegments,
    });
  } catch (error) {
    Debug.logError(error);
  }
};

const addExportListeners = ({
  onExportDidFail,
  onExportDidFinish,
  onExportDidUpdateProgress,
}) => {
  exportDidFinishListener = VideoExportManager.addDidFinishListener(
    onExportDidFinish
  );
  exportDidFailListener = VideoExportManager.addDidFailListener(
    onExportDidFail
  );
  exportDidUpdateProgressListener = VideoExportManager.addDidUpdateProgressListener(
    onExportDidUpdateProgress
  );
};

const removeExportListeners = () => {
  exportDidFinishListener && exportDidFinishListener.remove();
  exportDidFinishListener = null;
  exportDidFailListener && exportDidFailListener.remove();
  exportDidFailListener = null;
  exportDidUpdateProgressListener && exportDidUpdateProgressListener.remove();
  exportDidUpdateProgressListener = null;
};
