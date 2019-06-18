// @flow
import React, { PureComponent } from 'react';
import {
  createMediaStateHOC,
  authorizeMediaLibrary,
} from '@jonbrennecke/react-native-media';
import { autobind } from 'core-decorators';
import uniqBy from 'lodash/uniqBy';

import type { ComponentType } from 'react';
import type {
  MediaStateHOCProps,
  MediaObject,
} from '@jonbrennecke/react-native-media';

export type MediaGridStateExtraProps = {
  assetsArray: Array<MediaObject>,
  loadNextAssets: () => void,
};

export type MediaGridStateInputProps = {
  albumID: ?string,
};

export function wrapWithMediaGridState<
  PassThroughProps: Object,
  C: ComponentType<
    MediaGridStateExtraProps & MediaStateHOCProps & PassThroughProps
  >
>(
  WrappedComponent: C
): ComponentType<MediaGridStateInputProps & PassThroughProps> {
  // $FlowFixMe
  @autobind
  class ExplorerState extends PureComponent<
    MediaGridStateInputProps & MediaStateHOCProps & PassThroughProps
  > {
    async componentDidMount() {
      await authorizeMediaLibrary();
      await this.props.queryMedia({
        mediaType: 'video',
        ...(this.props.albumID
          ? {
              albumID: this.props.albumID,
            }
          : {}),
      });
    }

    componentDidUpdate(prevProps) {
      if (this.props.albumID !== prevProps.albumID) {
        this.reloadAssets();
      }
    }

    async reloadAssets() {
      await this.props.queryMedia({
        mediaType: 'video',
        ...(this.props.albumID
          ? {
              albumID: this.props.albumID,
            }
          : {}),
      });
    }

    loadNextAssets() {
      this.loadNextAssetsAsync();
    }

    async loadNextAssetsAsync() {
      const assetsSorted = this.getSortedAssets();
      const lastAsset = assetsSorted.last();
      if (!lastAsset) {
        return;
      }
      await this.props.queryMedia({
        mediaType: 'video',
        creationDateQuery: {
          date: lastAsset.creationDate,
          equation: 'lessThan',
        },
        ...(this.props.albumID
          ? {
              albumID: this.props.albumID,
            }
          : {}),
      });
    }

    getAssets() {
      if (this.props.albumID) {
        const albumAssets = this.props.albumAssets.get(this.props.albumID);
        if (albumAssets) {
          return this.props.assets.filter(a =>
            albumAssets.assetIDs.includes(a.assetID)
          );
        }
      }
      return this.props.assets;
    }

    getSortedAssets() {
      return this.getAssets()
        .sortBy(assets => assets.creationDate)
        .reverse();
    }

    render() {
      const assetsSorted = this.getSortedAssets();
      const uniqueAssets = uniqBy(assetsSorted.toJSON(), 'assetID');
      return (
        <WrappedComponent
          {...this.props}
          assetsArray={uniqueAssets}
          loadNextAssets={this.loadNextAssets}
        />
      );
    }
  }

  const withMediaState = createMediaStateHOC(state => state.newMedia);

  const Component = withMediaState(ExplorerState);

  const WrappedWithMediaGridState = props => <Component {...props} />;

  return WrappedWithMediaGridState;
}
