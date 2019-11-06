// @flow
import React, { createRef, PureComponent } from 'react';

import CaptionView from '../caption-view/CaptionView';

import type { CaptionViewProps } from '../caption-view/CaptionView';

export type PresetCaptionViewProps = CaptionViewProps;

export class PresetCaptionView extends PureComponent<PresetCaptionViewProps> {
  captionViewRef: { current: CaptionView | null } = createRef();

  componentDidMount() {
    if (this.captionViewRef.current) {
      this.captionViewRef.current.play();
    }
  }

  render() {
    return (
      <CaptionView
        {...this.props}
        ref={this.captionViewRef}
      />
    );
  }
}
