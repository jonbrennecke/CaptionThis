// @flow
/* eslint react/prop-types: 0, react/display-name: 0, flowtype/generic-spacing: 0 */
import React from 'react';
import { View } from 'react-native';
import { ThumbnailLoadMoreGrid } from '@jonbrennecke/react-native-media';

import { UI_COLORS } from '../../../../constants';

import {
  MediaGridHeader,
  MediaGridHeaderLabel,
  MediaGridHeaderAlbumsButton,
} from '../MediaGridHeader';
import { wrapWithMediaExplorerState } from '../../mediaExplorerState';

import type { SFC } from '../../../../types/react';
import type { MediaStateExtraProps } from '../../mediaExplorerState';
import type { MediaStateHOCProps } from '@jonbrennecke/react-native-media';

type MediaGridProps = {
  onSelectVideo: (assetID: string) => void,
  onPressAlbumsButton: () => void,
};

const styles = {
  container: {
    flex: 1,
  },
  grid: {
    flex: 1,
  },
  duration: {
    color: UI_COLORS.WHITE,
  },
};

const Component: SFC<
  MediaStateExtraProps & MediaGridProps & MediaStateHOCProps
> = ({ assetsArray, loadNextAssets, onPressAlbumsButton }) => {
  return (
    <View style={styles.container}>
      <MediaGridHeader>
        <MediaGridHeaderLabel text="Camera Roll" />
        <MediaGridHeaderAlbumsButton
          text="Albums"
          onPress={onPressAlbumsButton}
        />
      </MediaGridHeader>
      <ThumbnailLoadMoreGrid
        style={styles.grid}
        assets={assetsArray}
        extraDurationStyle={styles.duration}
        onRequestLoadMore={loadNextAssets}
      />
    </View>
  );
};

export const MediaGrid = wrapWithMediaExplorerState(Component);
