// @flow
import React, { Component } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { autobind } from 'core-decorators';
import isEqual from 'lodash/isEqual';
import clamp from 'lodash/clamp';
import round from 'lodash/round';

import CaptionPresetStyleView from './CaptionPresetStyleView';
import CaptionPresetAnimatedBorderView from './CaptionPresetAnimatedBorderView';

import type { Style } from '../../types/react';
import type { CaptionPresetStyleObject } from '../../types/video';

type Props = {
  style?: ?Style,
  presets: CaptionPresetStyleObject[],
  currentPreset: CaptionPresetStyleObject,
  onRequestSelectPreset: CaptionPresetStyleObject => void,
};

type State = {
  isDragging: boolean,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRESET_WIDTH = 45;
const PRESET_HEIGHT = 45;
const LEFT_PADDING = (SCREEN_WIDTH - PRESET_WIDTH) / 2;
const RIGHT_PADDING = (SCREEN_WIDTH - PRESET_WIDTH) / 2;

const styles = {
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  captionPreset: {
    flex: 1,
  },
  leftPadding: {
    backgroundColor: 'transparent',
    width: LEFT_PADDING,
  },
  rightPadding: {
    backgroundColor: 'transparent',
    width: RIGHT_PADDING,
  },
};

// $FlowFixMe
@autobind
export default class CaptionPresetStylesPicker extends Component<Props, State> {
  scrollView: ?ScrollView;
  state = {
    isDragging: false,
  };

  onScrollViewDidScroll(event: any) {
    const { contentOffset } = event.nativeEvent;
    const indexFloat = contentOffset.x / (PRESET_WIDTH + 10);
    const index = clamp(round(indexFloat), 0, this.props.presets.length);
    const preset = this.props.presets[index];
    this.props.onRequestSelectPreset(preset);
  }

  onScrollViewDidEndMomentumScroll(event: any) {
    const { contentOffset } = event.nativeEvent;
    this.scrollToPresetAtScrollOffset(contentOffset.x);
  }

  scrollToPresetAtScrollOffset(scrollOffset: number) {
    const indexFloat = scrollOffset / (PRESET_WIDTH + 10);
    const index = clamp(round(indexFloat), 0, this.props.presets.length);
    this.scrollToPresetAtIndex(index);
  }

  scrollToPresetAtIndex(index: number) {
    if (!this.scrollView) {
      return;
    }
    this.scrollView.scrollTo({
      x: index * (PRESET_WIDTH + 10),
      animated: true,
    });
  }

  onScrollViewDidBeginDrag() {
    this.setState({
      isDragging: true,
    });
  }

  onScrollViewDidEndDrag(event: any) {
    this.setState({
      isDragging: false,
    });
    const { contentOffset } = event.nativeEvent;
    this.scrollToPresetAtScrollOffset(contentOffset.x);
  }

  render() {
    return (
      <ScrollView
        ref={ref => {
          this.scrollView = ref;
        }}
        horizontal
        style={[styles.container, this.props.style]}
        showsHorizontalScrollIndicator={false}
        onScroll={this.onScrollViewDidScroll}
        scrollEventThrottle={this.state.isDragging ? 16 : 0}
        onMomentumScrollEnd={this.onScrollViewDidEndMomentumScroll}
        onScrollBeginDrag={this.onScrollViewDidBeginDrag}
        onScrollEndDrag={this.onScrollViewDidEndDrag}
      >
        <View style={styles.leftPadding} />
        {this.props.presets.map((preset, index) => {
          const isSelected = isEqual(preset, this.props.currentPreset);
          return (
            <CaptionPresetAnimatedBorderView
              isSelected={isSelected}
              key={`${preset.lineStyle}+${preset.textAlignment}`}
              size={{ width: PRESET_WIDTH, height: PRESET_HEIGHT }}
              onPress={() => this.scrollToPresetAtIndex(index)}
            >
              <CaptionPresetStyleView
                style={styles.captionPreset}
                presetStyle={preset}
                textSegments={[
                  // TODO: interpolate text segments in duration
                  {
                    duration: 0,
                    timestamp: 0,
                    text: 'the',
                  },
                  {
                    duration: 2.5,
                    timestamp: 0,
                    text: 'quick',
                  },
                  {
                    duration: 0,
                    timestamp: 0,
                    text: 'brown',
                  },
                  {
                    duration: 0,
                    timestamp: 0,
                    text: 'fox',
                  },
                  {
                    duration: 0,
                    timestamp: 0,
                    text: 'jumped',
                  },
                  {
                    duration: 0,
                    timestamp: 0,
                    text: 'over',
                  },
                  {
                    duration: 0,
                    timestamp: 0,
                    text: 'the',
                  },
                  {
                    duration: 0,
                    timestamp: 0,
                    text: 'lazy',
                  },
                  {
                    duration: 0,
                    timestamp: 0,
                    text: 'dog',
                  },
                ]}
              />
            </CaptionPresetAnimatedBorderView>
          );
        })}
        <View style={styles.rightPadding} />
      </ScrollView>
    );
  }
}
