// @flow
import React, { Component } from 'react';
import { View, Keyboard, Dimensions } from 'react-native';
import { autobind } from 'core-decorators';
// $FlowFixMe
import SafeArea, { withSafeArea } from 'react-native-safe-area';

import Button from '../../components/button/Button';
import SpeechTranscriptionEditor from '../../components/speech-transcription-editor/SpeechTranscriptionEditor';
import BottomSheetModal from '../../components/bottom-sheet-modal/BottomSheetModal';
import KeyboardAvoidingView from '../../components/keyboard-avoiding-view/KeyboardAvoidingView';
import FadeInOutAnimatedView from '../../components/animations/FadeInOutAnimatedView';
import * as Fonts from '../../utils/Fonts';
import { UI_COLORS } from '../../constants';

import type { VideoAssetIdentifier } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';

type Props = {
  videoID: VideoAssetIdentifier,
  isVisible: boolean,
  onRequestDismissModal: () => void,
  speechTranscription: ?SpeechTranscription,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
};

type State = {
  bottomSafeAreaInset: ?number,
  editorIsVisible: boolean,
};

const SafeAreaView = withSafeArea(View, 'padding', 'vertical');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = {
  flex: {
    flex: 1,
  },
  fullScreen: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  editor: {
    flex: 1,
  },
  mainContents: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  mainContentsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -200,
    backgroundColor: UI_COLORS.DARK_GREY,
  },
  button: {
    marginHorizontal: 10,
    marginTop: 7,
    backgroundColor: UI_COLORS.MEDIUM_GREY,
  },
  buttonText: Fonts.getFontStyle('button', { contentStyle: 'lightContent' }),
};

// $FlowFixMe
@autobind
export default class EditScreenEditCaptionsOverlay extends Component<
  Props,
  State
> {
  state = {
    bottomSafeAreaInset: null,
    editorIsVisible: false,
  };

  componentDidMount() {
    SafeArea.addEventListener(
      'safeAreaInsetsForRootViewDidChange',
      this.safeAreaInsetsForRootViewDidChange
    );
  }

  componentWillUnmount() {
    SafeArea.removeEventListener(
      'safeAreaInsetsForRootViewDidChange',
      this.safeAreaInsetsForRootViewDidChange
    );
  }

  safeAreaInsetsForRootViewDidChange({ safeAreaInsets: insets }: any) {
    this.setState({
      bottomSafeAreaInset: insets.bottom,
    });
  }

  editorDidEditSpeechTranscription(transcription: SpeechTranscription) {
    this.props.receiveSpeechTranscriptionSuccess(
      this.props.videoID,
      transcription
    );
  }

  async didPressDismissButton() {
    Keyboard.dismiss();
    this.props.onRequestDismissModal();
  }

  render() {
    return (
      <BottomSheetModal
        isVisible={this.props.isVisible}
        onRequestDismissModal={this.props.onRequestDismissModal}
        onShowModalAnimationDidEnd={() => {
          this.setState({
            editorIsVisible: true,
          });
        }}
        onHideModalAnimationDidEnd={() => {
          this.setState({
            editorIsVisible: false,
          });
        }}
      >
        <View style={styles.fullScreen}>
          <KeyboardAvoidingView
            style={styles.flex}
            keyboardVerticalOffset={-(this.state.bottomSafeAreaInset || 0) + 7}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.mainContentsBackground} />
              <FadeInOutAnimatedView
                style={styles.mainContents}
                isVisible={this.state.editorIsVisible}
              >
                {this.state.editorIsVisible ? (
                  <SpeechTranscriptionEditor
                    style={styles.editor}
                    speechTranscription={this.props.speechTranscription}
                    onDidEditSpeechTranscription={
                      this.editorDidEditSpeechTranscription
                    }
                  />
                ) : null}
              </FadeInOutAnimatedView>
              <Button
                style={styles.button}
                text="Done"
                onPress={this.props.onRequestDismissModal}
              />
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </BottomSheetModal>
    );
  }
}
