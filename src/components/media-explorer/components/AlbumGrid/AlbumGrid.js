// @flow
/* eslint react/prop-types: 0, react/display-name: 0, flowtype/generic-spacing: 0 */
import React from 'react';
import { AlbumExplorer } from '@jonbrennecke/react-native-media';

import { UI_COLORS } from '../../../../constants';

import { wrapWithAlbumGridState } from './albumGridState';

import type { SFC } from '../../../../types/react';
import type { AlbumGridStateExtraProps } from './albumGridState';
import type { MediaStateHOCProps } from '@jonbrennecke/react-native-media';

type AlbumGridProps = {
  onSelectAlbum: (albumID: string) => void,
};

const styles = {
  flex: {
    flex: 1,
  },
  albumTitleStyle: {
    color: UI_COLORS.WHITE,
  },
};

const Component: SFC<
  AlbumGridStateExtraProps & AlbumGridProps & MediaStateHOCProps
> = ({ albumsArray, loadNextAlbums, onSelectAlbum, assetsForAlbum, isLoadingAssetsForAlbum, queryMedia }) => {
  return (
    <AlbumExplorer
      albums={albumsArray}
      style={styles.flex}
      albumTitleStyle={styles.albumTitleStyle}
      onPressAlbum={onSelectAlbum}
      onRequestLoadMore={loadNextAlbums}
      thumbnailAssetIDForAlbumID={albumID => {
        const assets = assetsForAlbum(albumID);
        if (assets && assets.loadingStatus !== 'isLoading') {
          return assets.assetIDs.first();
        }
        if (!isLoadingAssetsForAlbum(albumID)) {
          queryMedia({ albumID, limit: 1 });
          return; // TODO: add loading UI
        }
        return;
      }}
    />
  );
};

export const AlbumGrid = wrapWithAlbumGridState(Component);
