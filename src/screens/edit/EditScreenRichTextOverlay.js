// @flow
import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { autobind } from 'core-decorators';

import { UI_COLORS } from '../../constants';
import RichTextEditor from '../../components/rich-text-editor/RichTextEditor';
import BottomSheetModal from '../../components/bottom-sheet-modal/BottomSheetModal';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';
import type { LineStyle } from '../../types/video';

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
  speechTranscription: ?SpeechTranscription,
  lineStyle: LineStyle,
  onRequestSave: ({
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
  }) => void,
  onRequestDismissWithoutSaving: () => void,
};

const styles = {
  insideWrap: {
    flex: 1,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 45,
    shadowColor: UI_COLORS.OFF_BLACK,
    justifyContent: 'center',
  },
  inside: {
    flex: 1,
  },
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

  render() {
    return (
      <BottomSheetModal
        isVisible={this.props.isVisible}
        onRequestDismissModal={this.props.onRequestDismissWithoutSaving}
      >
        <SafeAreaView style={styles.flex}>
          <View style={styles.insideWrap}>
            <RichTextEditor
              ref={ref => {
                this.richTextEditor = ref;
              }}
              style={styles.inside}
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
              onRequestSave={this.props.onRequestSave}
            />
          </View>
        </SafeAreaView>
      </BottomSheetModal>
    );
  }
}
