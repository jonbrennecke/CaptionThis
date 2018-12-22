// @flow
import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';

import type { Style } from '../../types/react';

type ButtonSize = 'small' | 'large';
type ButtonShadowStyle = 'flat' | 'thin' | 'large';

type Props = {
  style?: Style | Style[],
  size: ButtonSize,
  shadowStyle: ButtonShadowStyle,
  disabled?: boolean,
  text: string,
  onPress: () => void,
};

const styles = {
  button: (size: ButtonSize) => ({
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI_COLORS.DARK_GREY,
    paddingHorizontal: size === 'small' ? 37 : 45,
    paddingVertical: size === 'small' ? 7 : 12,
    borderRadius: 5,
  }),
  buttonShadow: (shadowStyle: ButtonShadowStyle) => ({
    elevation: getShadowElevation(shadowStyle),
  }),
  disabled: {
    opacity: 0.5,
  },
  contextButtonText: Fonts.getFontStyle('button'),
};

export default class Button extends Component<Props, {}> {
  static defaultProps = {
    size: 'small',
    shadowStyle: 'thin',
  };

  render() {
    return (
      <TouchableOpacity
        style={[
          styles.button(this.props.size),
          styles.buttonShadow(this.props.shadowStyle),
          this.props.disabled && styles.disabled,
          this.props.style,
        ]}
        disabled={this.props.disabled}
        onPress={this.props.onPress}
      >
        <Text numberOfLines={1} style={styles.contextButtonText}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}

function getShadowElevation(shadowStyle: ButtonShadowStyle): number {
  switch (shadowStyle) {
    case 'thin':
      return 1;
    case 'large':
      return 5;
    default:
      return 0;
  }
}
