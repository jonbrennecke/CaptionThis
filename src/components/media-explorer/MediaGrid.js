// @flow
import React from 'react';
import { ThumbnailLoadMoreGrid } from '@jonbrennecke/react-native-media';

import { wrapWithMediaExplorerState } from './mediaExplorerState';
import { UI_COLORS } from '../../constants';

import type { SFC } from '../../types/react';
import type { MediaStateExtraProps } from './mediaExplorerState';
import type { MediaStateHOCProps } from '@jonbrennecke/react-native-media';

type MediaGridProps = {
  onSelectVideo: (assetID: string) => void,
};

const styles = {
  grid: {
    flex: 1,
  },
  duration: {
    color: UI_COLORS.WHITE,
  },
};

const X: SFC<MediaStateExtraProps & MediaGridProps & MediaStateHOCProps> = ({
  // eslint-disable-next-line react/prop-types
  assetsArray,
  // eslint-disable-next-line react/prop-types
  loadNextAssets,
}) => {
  return (
    <ThumbnailLoadMoreGrid
      style={styles.grid}
      assets={assetsArray}
      extraDurationStyle={styles.duration}
      onRequestLoadMore={loadNextAssets}
    />
  );
};

export const MediaGrid = wrapWithMediaExplorerState(X);
