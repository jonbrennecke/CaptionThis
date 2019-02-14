// @flow
import StyleSheetPropType from 'react-native/Libraries/StyleSheet/StyleSheetPropType';
import ViewStylePropTypes from 'react-native/Libraries/Components/View/ViewStylePropTypes';

import type { Element, ChildrenArray } from 'react';
import type { NativeEventEmitter } from 'react-native';
import type { Return } from './util';

export type Children = ChildrenArray<?Element<*>> | string;

const stylePropType = StyleSheetPropType(ViewStylePropTypes);

export type Style = stylePropType;

export type Gesture = {
  moveX: number,
  moveY: number,
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  vx: number,
  vy: number,
};

export type ReactAppStateEnum = 'active' | 'background' | 'inactive';

export type EmitterSubscription = Return<NativeEventEmitter.addListener>;
