// @flow
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';

export type MediaStateExtraProps = {
  isAlbumModalVisible: boolean,
  onRequestShowAlbumModal: () => void,
  onRequestHideAlbumModal: () => void
};

export type MediaState = {
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
      isAlbumModalVisible: false,
    };

    setAlbumModalVisibility(isVisible: boolean) {
      this.setState({
        isAlbumModalVisible: isVisible
      });
    }
    
    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onRequestHideAlbumModal={() => this.setAlbumModalVisibility(false)}
          onRequestShowAlbumModal={() => this.setAlbumModalVisibility(true)}
        />
      );
    }
  }

  return ExplorerState;
}
