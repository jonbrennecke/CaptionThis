// @flow
/* eslint react/prop-types: 0, react/display-name: 0, flowtype/generic-spacing: 0 */
import React from 'react';
import { View } from 'react-native';
import { AlbumExplorer } from '@jonbrennecke/react-native-media';

import * as Fonts from '../../../../utils/Fonts';
import {
  MediaGridHeader,
  MediaGridHeaderCloseButton,
} from '../MediaGridHeader';

import { wrapWithAlbumGridState } from './albumGridState';

import type { SFC } from '../../../../types/react';
import type { AlbumGridStateExtraProps } from './albumGridState';
import type { MediaStateHOCProps } from '@jonbrennecke/react-native-media';

type AlbumGridProps = {
  onPressCloseButton: () => void,
  onSelectAlbum: (albumID: string) => void,
};

const styles = {
  flex: {
    flex: 1,
  },
  title: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
  background: {},
};

const Component: SFC<
  AlbumGridStateExtraProps & AlbumGridProps & MediaStateHOCProps
> = ({
  albumsArray,
  loadNextAlbums,
  onSelectAlbum,
  assetsForAlbum,
  isLoadingAssetsForAlbum,
  queryMedia,
  onPressCloseButton,
}) => {
  const albums = albumsArray.filter(album => {
    const assets = assetsForAlbum(album.albumID);
    if (!assets) {
      return true;
    }
    if (assets.loadingStatus === 'isLoading') {
      return false;
    }
    return !!assets.assetIDs.first();
  });
  return (
    <View style={styles.flex}>
      <MediaGridHeader>
        <MediaGridHeaderCloseButton text="Back" onPress={onPressCloseButton} />
      </MediaGridHeader>
      <AlbumExplorer
        albums={albums}
        style={styles.flex}
        albumTitleStyle={styles.title}
        backgroundStyle={styles.background}
        onPressAlbum={onSelectAlbum}
        onRequestLoadMore={loadNextAlbums}
        thumbnailAssetIDForAlbumID={albumID => {
          const assets = assetsForAlbum(albumID);
          if (assets && assets.loadingStatus !== 'isLoading') {
            return assets.assetIDs.first();
          }
          if (!isLoadingAssetsForAlbum(albumID)) {
            queryMedia({ albumID, limit: 1, mediaType: 'video' });
            return; // TODO: add loading UI
          }
          return;
        }}
      />
    </View>
  );
};

export const AlbumGrid = wrapWithAlbumGridState(Component);
