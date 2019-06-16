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
  AlbumObject,
} from '@jonbrennecke/react-native-media';

export type AlbumGridStateExtraProps = {
  albumsArray: Array<AlbumObject>,
  loadNextAlbums: () => void,
};

export function wrapWithAlbumGridState<
  PassThroughProps: Object,
  C: ComponentType<AlbumGridStateExtraProps & MediaStateHOCProps & PassThroughProps>
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class AlbumExplorerState extends PureComponent<
    MediaStateHOCProps & PassThroughProps
  > {
    async componentDidMount() {
      await authorizeMediaLibrary();
      await this.props.queryAlbums({});
    }

    loadNextAlbums() {
      this.loadNextAlbumsAsync();
    }

    async loadNextAlbumsAsync() {
      const albumsSorted = this.props.albums.sortBy(album => album.title);
      const last = albumsSorted.last();
      if (!last) {
        return;
      }
      await this.props.queryAlbums({
        limit: 3,
        titleQuery: {
          title: last.title,
          equation: 'greaterThan',
        },
      });
    }

    render() {
      const albumsSorted = this.props.albums.sortBy(album => album.title);
      const uniqueAlbums = uniqBy(albumsSorted.toJSON(), 'albumID');
      return (
        <WrappedComponent
          {...this.props}
          albumsArray={uniqueAlbums}
          loadNextAlbums={this.loadNextAlbums}
        />
      );
    }
  }

  const withMediaState = createMediaStateHOC(state => state.newMedia);

  const Component = withMediaState(AlbumExplorerState);

  const WrappedWithAlbumGridState = props => <Component {...props} />;

  return WrappedWithAlbumGridState;
}
