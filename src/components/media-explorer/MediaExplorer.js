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
import type { MediaObject } from '@jonbrennecke/react-native-media';

export type MediaExplorerProps = {
  onSelectVideo: (video: MediaObject) => void,
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
  albumID,
  onRequestFilterByAlbum,
  onRequestShowAlbumModal,
  onRequestHideAlbumModal,
}) => (
  <SafeAreaView style={styles.flex}>
    <MediaGrid
      albumID={albumID}
      onSelectVideo={onSelectVideo}
      onPressAlbumsButton={onRequestShowAlbumModal}
    />
    <AlbumExplorerModal
      isVisible={isAlbumModalVisible}
      onSelectAlbum={onRequestFilterByAlbum}
      onRequestDismiss={onRequestHideAlbumModal}
    />
  </SafeAreaView>
);

export const MediaExplorer = wrapWithMediaExplorerState(Component);
