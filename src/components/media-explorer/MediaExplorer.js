// @flow
import React from 'react';
import { View } from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

import { MediaGrid } from './components';

import type { SFC } from '../../types/react';

export type MediaExplorerProps = {
  onSelectVideo: (assetID: string) => void,
};

const SafeAreaView = withSafeArea(View, 'padding', 'vertical');

const styles = {
  flex: {
    flex: 1,
  },
};

export const MediaExplorer: SFC<MediaExplorerProps> = ({
  onSelectVideo,
}: MediaExplorerProps) => (
  <SafeAreaView style={styles.flex}>
    <MediaGrid
      onSelectVideo={onSelectVideo}
      onPressAlbumsButton={() => {
        /* TODO open albums modal */
      }}
    />
  </SafeAreaView>
);
