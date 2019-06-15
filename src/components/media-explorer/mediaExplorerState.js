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

export type MediaStateExtraProps = {
  assetsArray: Array<MediaObject>,
  loadNextAssets: () => void,
};

export function wrapWithMediaExplorerState<
  PassThroughProps: Object,
  C: ComponentType<MediaStateExtraProps & MediaStateHOCProps & PassThroughProps>
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class ExplorerState extends PureComponent<
    MediaStateHOCProps & PassThroughProps
  > {
    async componentDidMount() {
      await authorizeMediaLibrary();
      await this.props.queryMedia({
        mediaType: 'video',
      });
    }

    loadNextAssets() {
      this.loadNextAssetsAsync();
    }

    async loadNextAssetsAsync() {
      const assetsSorted = this.props.assets
        .sortBy(assets => assets.creationDate)
        .reverse();
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
      });
    }

    render() {
      const assetsSorted = this.props.assets
        .sortBy(assets => assets.creationDate)
        .reverse();
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

  const WrappedWithMediaExplorerState = props => <Component {...props} />;

  return WrappedWithMediaExplorerState;
}
