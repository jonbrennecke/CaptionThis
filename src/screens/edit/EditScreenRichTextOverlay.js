// @flow
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { autobind } from 'core-decorators';

import RichTextEditor from '../../components/rich-text-editor/RichTextEditor';
import BottomSheetModal from '../../components/bottom-sheet-modal/BottomSheetModal';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';
import type { LineStyle, TextAlignmentMode } from '../../types/video';

type Props = {
  style?: ?Style,
  playbackTime: number,
  hasFinalTranscription: boolean,
  isVisible: boolean,
  duration: number,
  fontFamily: string,
  fontSize: number,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  alignmentMode: TextAlignmentMode,
  lineStyle: LineStyle,
  speechTranscription: ?SpeechTranscription,
  onRequestSave: ({
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
    alignmentMode: TextAlignmentMode,
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
            playbackTime={this.props.playbackTime}
            duration={this.props.duration}
            isVisible={this.props.isVisible}
            hasFinalTranscription={this.props.hasFinalTranscription}
            speechTranscription={this.props.speechTranscription}
            fontSize={this.props.fontSize}
            fontFamily={this.props.fontFamily}
            textColor={this.props.textColor}
            backgroundColor={this.props.backgroundColor}
            lineStyle={this.props.lineStyle}
            alignmentMode={this.props.alignmentMode}
            onRequestSave={this.props.onRequestSave}
          />
        </SafeAreaView>
      </BottomSheetModal>
    );
  }
}
