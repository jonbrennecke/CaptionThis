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
import { wrapWithMediaGridState } from './mediaGridState';

import type {
  MediaStateHOCProps,
  MediaObject,
} from '@jonbrennecke/react-native-media';

import type { SFC } from '../../../../types/react';
import type { MediaGridStateExtraProps } from './mediaGridState';

type MediaGridProps = {
  onSelectVideo: (video: MediaObject) => void,
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
  MediaGridStateExtraProps & MediaGridProps & MediaStateHOCProps
> = ({
  assets,
  assetsArray,
  loadNextAssets,
  onPressAlbumsButton,
  onSelectVideo,
}) => {
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
        onPressThumbnail={assetID => {
          const video = assets.find(a => a.assetID === assetID);
          video && onSelectVideo(video);
        }}
      />
    </View>
  );
};

export const MediaGrid = wrapWithMediaGridState(Component);
