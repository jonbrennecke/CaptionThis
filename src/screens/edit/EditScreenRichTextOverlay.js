// @flow
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { autobind } from 'core-decorators';

import RichTextEditor from '../../components/rich-text-editor/RichTextEditor';
import BottomSheetModal from '../../components/bottom-sheet-modal/BottomSheetModal';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';
import type { LineStyle } from '../../types/video';

type Props = {
  style?: ?Style,
  isReadyToPlay: boolean,
  isVisible: boolean,
  duration: number,
  fontFamily: string,
  fontSize: number,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  speechTranscription: ?SpeechTranscription,
  lineStyle: LineStyle,
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
export default class EditScreenRichTextOverlay extends Component<Props> {
  richTextEditor: ?RichTextEditor;

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
            isReadyToPlay={this.props.isReadyToPlay}
            speechTranscription={this.props.speechTranscription}
            fontSize={this.props.fontSize}
            fontFamily={this.props.fontFamily}
            textColor={this.props.textColor}
            backgroundColor={this.props.backgroundColor}
            lineStyle={this.props.lineStyle}
            onRequestSave={this.props.onRequestSave}
          />
        </SafeAreaView>
      </BottomSheetModal>
    );
  }
}
