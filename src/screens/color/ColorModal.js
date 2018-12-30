// @flow
import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { BlurView } from 'react-native-blur';

import { UI_COLORS } from '../../constants';
import * as Color from '../../utils/Color';
import * as Screens from '../../utils/Screens';
import ColorModalNavControls from './ColorModalNavControls';
import ColorPicker from '../../components/color-picker/ColorPicker';
import { getBackgroundColor, getTextColor } from '../../redux/media/selectors';
import {
  receiveUserSelectedTextColor,
  receiveUserSelectedBackgroundColor,
} from '../../redux/media/actionCreators';

import type { AppState, Dispatch } from '../../types/redux';
import type { ColorRGBA } from '../../types/media';

type OwnProps = {};

type StateProps = {
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
};

type DispatchProps = {
  receiveUserSelectedTextColor: ColorRGBA => void,
  receiveUserSelectedTextColor: ColorRGBA => void,
};

type Props = OwnProps & StateProps & DispatchProps;

const styles = {
  container: {
    flex: 1,
    backgroundColor: Color.hexToRgbaString(UI_COLORS.DARK_GREY, 0.25),
    paddingHorizontal: 15,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flex: {
    flex: 1,
  },
};

function mapStateToProps(state: AppState): StateProps {
  return {
    backgroundColor: getBackgroundColor(state),
    textColor: getTextColor(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    receiveUserSelectedTextColor: (color: ColorRGBA) =>
      dispatch(receiveUserSelectedTextColor(color)),
    receiveUserSelectedBackgroundColor: (color: ColorRGBA) =>
      dispatch(receiveUserSelectedBackgroundColor(color)),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class FontModal extends Component<Props> {
  onBackButtonPress() {
    Screens.dismissColorModal();
  }

  render() {
    return (
      <View style={styles.container}>
        <BlurView style={styles.blurView} blurType="dark" />
        <SafeAreaView style={styles.flex}>
          <ColorModalNavControls onBackButtonPress={this.onBackButtonPress} />
          <ColorPicker style={styles.flex} color={this.props.backgroundColor} />
        </SafeAreaView>
      </View>
    );
  }
}
