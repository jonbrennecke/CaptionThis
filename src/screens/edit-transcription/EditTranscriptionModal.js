// @flow
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { BlurView } from 'react-native-blur';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

import SpeechTranscriptionEditor from '../../components/speech-transcription-editor/SpeechTranscriptionEditor';
import { getSpeechTranscriptions } from '../../redux/media/selectors';
import { receiveSpeechTranscriptionSuccess } from '../../redux/media/actionCreators';
import * as Fonts from '../../utils/Fonts';
import * as Screens from '../../utils/Screens';

import type { VideoAssetIdentifier } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';
import type { AppState, Dispatch } from '../../types/redux';

type OwnProps = {
  videoAssetIdentifier: VideoAssetIdentifier,
};

type StateProps = {
  speechTranscriptions: Map<VideoAssetIdentifier, SpeechTranscription>,
};

type DispatchProps = {
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
};

type Props = OwnProps & StateProps & DispatchProps;

const SafeAreaView = withSafeArea(View, 'padding', 'top');

const styles = {
  flex: {
    flex: 1,
  },
  nav: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  saveButtonText: Fonts.getFontStyle('button', { contentStyle: 'darkContent' }),
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

function mapStateToProps(state: AppState): StateProps {
  return {
    speechTranscriptions: getSpeechTranscriptions(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    receiveSpeechTranscriptionSuccess: (
      video: VideoAssetIdentifier,
      transcription: SpeechTranscription
    ) => dispatch(receiveSpeechTranscriptionSuccess(video, transcription)),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class EditTranscriptionModal extends Component<Props> {
  getSpeechTranscription(): ?SpeechTranscription {
    const { speechTranscriptions, videoAssetIdentifier: key } = this.props;
    if (!speechTranscriptions.has(key)) {
      return null;
    }
    return speechTranscriptions.get(key);
  }

  editorDidEditSpeechTranscription(transcription: SpeechTranscription) {
    this.props.receiveSpeechTranscriptionSuccess(this.props.videoAssetIdentifier, transcription);
  }

  async didPressDismissButton() {
    Keyboard.dismiss();
    await Screens.dismissEditTranscriptionModal();
  }

  render() {
    const speechTranscription = this.getSpeechTranscription();
    return (
      <View style={styles.flex}>
        <BlurView style={styles.blurView} blurType="xlight" blurAmount={25} />
        <SafeAreaView style={styles.flex}>
          <View style={styles.nav}>
            <TouchableOpacity onPress={this.didPressDismissButton}>
              <Text style={styles.saveButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <SpeechTranscriptionEditor
            style={styles.flex}
            speechTranscription={speechTranscription}
            onDidEditSpeechTranscription={this.editorDidEditSpeechTranscription}
          />
        </SafeAreaView>
      </View>
    );
  }
}
