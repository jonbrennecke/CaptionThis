// @flow
import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';

import type { Children, Style } from '../../types/react';

type Props = {
  children: Children,
  style?: ?Style,
};

export default function KeyboardAvoidingViewFix({
  style,
  children,
  ...etc
}: Props) {
  return Platform.select({
    ios: (
      <KeyboardAvoidingView style={style} behavior="padding" enabled {...etc}>
        {children}
      </KeyboardAvoidingView>
    ),
    android: (
      <View style={style} {...etc}>
        {children}
      </View>
    ),
  });
}
