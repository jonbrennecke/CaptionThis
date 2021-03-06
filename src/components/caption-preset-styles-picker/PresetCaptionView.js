// @flow
import React, { createRef, PureComponent } from 'react';

import CaptionView from '../caption-view/CaptionView';

import type { CaptionViewProps } from '../caption-view/CaptionView';

export type PresetCaptionViewProps = CaptionViewProps;

const presetDefaultFontSize = 8;

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
        captionStyle={{
          ...this.props.captionStyle,
          fontSize: presetDefaultFontSize,
        }}
        ref={this.captionViewRef}
      />
    );
  }
}
