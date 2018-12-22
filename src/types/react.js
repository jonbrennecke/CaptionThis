// @flow
import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type { Element, ChildrenArray } from 'react';

export type Children = ChildrenArray<?Element<*>> | string;

export type Style = StyleObj;
