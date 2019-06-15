// @flow
import React from 'react';
import { View, Text } from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

import * as Fonts from '../../utils/Fonts';

import { MediaGrid } from './MediaGrid';

import type { SFC } from '../../types/react';

export type MediaExplorerProps = {
  onSelectVideo: (assetID: string) => void,
};

const SafeAreaView = withSafeArea(View, 'padding', 'vertical');

const styles = {
  flex: {
    flex: 1,
  },
  mediaHeader: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    alignItems: 'flex-start',
  },
  mediaText: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
};

export const MediaExplorer: SFC<MediaExplorerProps> = ({
  onSelectVideo,
}: MediaExplorerProps) => (
  <SafeAreaView style={styles.flex}>
    <View style={styles.mediaHeader}>
      <Text style={styles.mediaText}>Camera Roll</Text>
    </View>
    <MediaGrid onSelectVideo={onSelectVideo} />
  </SafeAreaView>
);
