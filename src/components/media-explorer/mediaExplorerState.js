// @flow
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';

export type MediaStateExtraProps = {
  isAlbumModalVisible: boolean,
  albumID: ?string,
  onRequestFilterByAlbum: (albumID: string) => void,
  onRequestShowAlbumModal: () => void,
  onRequestHideAlbumModal: () => void,
};

export type MediaState = {
  albumID: ?string,
  isAlbumModalVisible: boolean,
};

export function wrapWithMediaExplorerState<
  PassThroughProps: Object,
  C: ComponentType<MediaStateExtraProps & PassThroughProps>
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class ExplorerState extends PureComponent<PassThroughProps, MediaState> {
    state = {
      albumID: null,
      isAlbumModalVisible: false,
    };

    setAlbumModalVisibility(isVisible: boolean) {
      this.setState({
        isAlbumModalVisible: isVisible,
      });
    }

    filterByAlbum(albumID: string) {
      this.setState({ albumID }, () => {
        this.setAlbumModalVisibility(false);
      });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onRequestFilterByAlbum={this.filterByAlbum}
          onRequestHideAlbumModal={() => this.setAlbumModalVisibility(false)}
          onRequestShowAlbumModal={() => this.setAlbumModalVisibility(true)}
        />
      );
    }
  }

  return ExplorerState;
}
