// @flow
/* eslint react/prop-types: 0, react/display-name: 0, flowtype/generic-spacing: 0 */
import React from 'react';
import { View } from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

import { MediaGrid, AlbumExplorerModal } from './components';
import { wrapWithMediaExplorerState } from './mediaExplorerState';

import type { MediaStateExtraProps } from './mediaExplorerState';
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

const Component: SFC<MediaStateExtraProps & MediaExplorerProps> = ({
  isAlbumModalVisible,
  onSelectVideo,
  onRequestShowAlbumModal,
  onRequestHideAlbumModal
}) => (
  <SafeAreaView style={styles.flex}>
    <MediaGrid
      onSelectVideo={onSelectVideo}
      onPressAlbumsButton={onRequestShowAlbumModal}
    />
    <AlbumExplorerModal
      isVisible={isAlbumModalVisible}
      onRequestDismiss={onRequestHideAlbumModal}
    />
  </SafeAreaView>
);

export const MediaExplorer = wrapWithMediaExplorerState(Component);
