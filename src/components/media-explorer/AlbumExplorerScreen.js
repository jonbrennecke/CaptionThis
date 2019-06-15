// @flow
import React from 'react';
import {
  AlbumExplorer,
  MediaStateContainer,
} from '@jonbrennecke/react-native-media';
import noop from 'lodash/noop';

const styles = {
  container: {
    flex: 1,
  },
  explorer: {
    flex: 1,
  },
  albumTitleStyle: {},
};

export const MediaGrid = MediaStateContainer(
  ({
    albums,
    assetsForAlbum,
    isLoadingAssetsForAlbum,
    queryMedia,
    queryAlbums,
  }) => (
    <AlbumExplorer
      albums={albums.toJSON()}
      style={styles.explorer}
      albumTitleStyle={styles.albumTitleStyle}
      onPressAlbum={noop}
      thumbnailAssetIDForAlbumID={albumID => {
        const assets = assetsForAlbum(albumID);
        if (assets && assets.loadingStatus !== 'isLoading') {
          return assets.assetIDs.first();
        }
        if (!isLoadingAssetsForAlbum(albumID)) {
          queryMedia({ albumID });
          return; // TODO: add loading UI
        }
        return;
      }}
      onRequestLoadMore={loadMore}
    />
  )
);
