// @flow
import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { BlurView } from 'react-native-blur';
import throttle from 'lodash/throttle';

import { UI_COLORS, USER_EDITABLE_COLORS } from '../../constants';
import * as Color from '../../utils/Color';
import * as Screens from '../../utils/Screens';
import ColorModalNavControls from './ColorModalNavControls';
import ColorPicker from '../../components/color-picker/ColorPicker';
import Button from '../../components/button/Button';
import { getBackgroundColor, getTextColor } from '../../redux/media/selectors';
import {
  receiveUserSelectedTextColor,
  receiveUserSelectedBackgroundColor,
} from '../../redux/media/actionCreators';

import type { AppState, Dispatch } from '../../types/redux';
import type { ColorRGBA } from '../../types/media';

type State = {
  color: ColorRGBA,
};

type OwnProps = {
  editableColor: $Keys<typeof USER_EDITABLE_COLORS>,
};

type StateProps = {
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
};

type DispatchProps = {
  receiveUserSelectedBackgroundColor: ColorRGBA => void,
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
  safeArea: {
    flex: 1,
  },
  saveButton: (color: ColorRGBA) => ({
    backgroundColor: Color.rgbaObjectToRgbaString(color),
  }),
  colorPicker: {},
};

function mapStateToProps(state: AppState): StateProps {
  return {
    backgroundColor: getBackgroundColor(state),
    textColor: getTextColor(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
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
export default class FontModal extends Component<Props, State> {
  state = {
    color: Color.hexToRgbaObject(UI_COLORS.DARK_GREY),
  };

  componentWillMount() {
    this.setState({
      color: this.originalColor(),
    });
  }

  originalColor(): ColorRGBA {
    switch (this.props.editableColor) {
      case USER_EDITABLE_COLORS.BACKGROUND_COLOR:
        return this.props.backgroundColor;
      case USER_EDITABLE_COLORS.TEXT_COLOR:
        return this.props.textColor;
      default:
        return Color.hexToRgbaObject(UI_COLORS.DARK_GREY);
    }
  }

  async onBackButtonPress() {
    await Screens.dismissColorModal();
  }

  colorPickerDidUpdateColorThrottled = throttle(
    this.colorPickerDidUpdateColor,
    100,
    { leading: true }
  );

  colorPickerDidUpdateColor(color: ColorRGBA) {
    this.setState({
      color,
    });
  }

  async saveButtonWasPressed() {
    switch (this.props.editableColor) {
      case USER_EDITABLE_COLORS.BACKGROUND_COLOR:
        this.props.receiveUserSelectedBackgroundColor(this.state.color);
        break;
      case USER_EDITABLE_COLORS.TEXT_COLOR:
        this.props.receiveUserSelectedTextColor(this.state.color);
        break;
      default:
        break;
    }
    await Screens.dismissColorModal();
  }

  render() {
    return (
      <View style={styles.container}>
        <BlurView style={styles.blurView} blurType="dark" />
        <SafeAreaView style={styles.safeArea}>
          <ColorModalNavControls
            onBackButtonPress={() => {
              this.onBackButtonPress();
            }}
          />
          <ColorPicker
            style={styles.colorPicker}
            color={this.state.color}
            onDidUpdateColor={this.colorPickerDidUpdateColorThrottled}
          />
          <Button
            size="large"
            text="SAVE"
            style={styles.saveButton(this.state.color)}
            onPress={() => {
              this.saveButtonWasPressed();
            }}
          />
        </SafeAreaView>
      </View>
    );
  }
}
