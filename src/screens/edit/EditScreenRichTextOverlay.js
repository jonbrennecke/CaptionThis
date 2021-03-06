// @flow
import React, { PureComponent } from 'react';
import { SafeAreaView } from 'react-native';
import { autobind } from 'core-decorators';

import RichTextEditor from '../../components/rich-text-editor/RichTextEditor';
import BottomSheetModal from '../../components/bottom-sheet-modal/BottomSheetModal';

import type { SpeechTranscription } from '@jonbrennecke/react-native-speech';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';
import type { CaptionStyleObject } from '../../types/video';

type EditScreenRichTextOverlayProps = {
  style?: ?Style,
  isVisible: boolean,
  duration: number,
  captionStyle: CaptionStyleObject,
  playbackTime: number,
  speechTranscription: ?SpeechTranscription,
  onRequestSave: ({
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
  }) => void,
};

const styles = {
  flex: {
    flex: 1,
  },
};

// $FlowFixMe
@autobind
export default class EditScreenRichTextOverlay extends PureComponent<
  EditScreenRichTextOverlayProps
> {
  richTextEditor: ?RichTextEditor;

  componentDidUpdate(prevProps: EditScreenRichTextOverlayProps) {
    if (this.props.isVisible !== prevProps.isVisible) {
      if (this.props.isVisible) {
        this.seekCaptionsToTime(this.props.playbackTime);
        this.playCaptions();
        return;
      }
      this.pauseCaptions();
    }
  }

  playCaptions() {
    if (this.richTextEditor) {
      this.richTextEditor.playCaptions();
    }
  }

  restartCaptions() {
    if (this.richTextEditor) {
      this.richTextEditor.restartCaptions();
    }
  }

  pauseCaptions() {
    if (this.richTextEditor) {
      this.richTextEditor.pauseCaptions();
    }
  }

  seekCaptionsToTime(time: number) {
    if (this.richTextEditor) {
      this.richTextEditor.seekCaptionsToTime(time);
    }
  }

  save() {
    if (this.richTextEditor) {
      this.richTextEditor.save();
    }
  }

  render() {
    return (
      <BottomSheetModal
        isVisible={this.props.isVisible}
        onRequestDismissModal={this.save}
      >
        <SafeAreaView style={styles.flex}>
          <RichTextEditor
            ref={ref => {
              this.richTextEditor = ref;
            }}
            style={styles.flex}
            duration={this.props.duration}
            isVisible={this.props.isVisible}
            speechTranscription={this.props.speechTranscription}
            captionStyle={this.props.captionStyle}
            onRequestSave={this.props.onRequestSave}
          />
        </SafeAreaView>
      </BottomSheetModal>
    );
  }
}
