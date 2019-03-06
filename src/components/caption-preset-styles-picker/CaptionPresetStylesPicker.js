// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { autobind } from 'core-decorators';
import isEqual from 'lodash/isEqual';
import clamp from 'lodash/clamp';
import round from 'lodash/round';

import { UI_COLORS } from '../../constants';
import CaptionPresetStyleView from './CaptionPresetStyleView';

import type { Style } from '../../types/react';
import type { PresetObject } from '../../types/video';

type Props = {
  style?: ?Style,
  presets: PresetObject[],
  currentPreset: PresetObject,
  onRequestSelectPreset: PresetObject => void,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRESET_WIDTH = 50;
const PRESET_HEIGHT = 50;
const LEFT_PADDING = (SCREEN_WIDTH - PRESET_WIDTH) / 2;
const RIGHT_PADDING = (SCREEN_WIDTH - PRESET_WIDTH) / 2;

const styles = {
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  captionPresetWrap: (isSelected: boolean) => ({
    height: PRESET_HEIGHT,
    width: PRESET_WIDTH,
    marginRight: 10,
    transform: [
      {
        scale: isSelected ? 1.25 : 1,
      },
    ],
  }),
  border: (isSelected: boolean) => ({
    borderWidth: 1.5,
    borderColor: isSelected ? UI_COLORS.WHITE : 'transparent',
    overflow: 'hidden',
    borderRadius: 6,
    position: 'absolute',
    height: PRESET_HEIGHT,
    width: PRESET_WIDTH,
    shadowOffset: {
      width: 0,
      height: 0.2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowColor: UI_COLORS.BLACK,
  }),
  borderInner: {
    borderRadius: 6,
    padding: 5,
    backgroundColor: UI_COLORS.MEDIUM_GREY,
    flex: 1,
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
export default class CaptionPresetStylesPicker extends Component<Props> {
  scrollView: ?ScrollView;

  onScroll(event: any) {
    const { contentOffset } = event.nativeEvent;
    const indexFloat = contentOffset.x / (PRESET_WIDTH + 10);
    const index = clamp(round(indexFloat), 0, this.props.presets.length);
    const preset = this.props.presets[index];
    this.props.onRequestSelectPreset(preset);
  }

  onMomentumScrollEnd(event: any) {
    const { contentOffset } = event.nativeEvent;
    this.scrollToPresetAtScrollOffset(contentOffset.x);
  }

  scrollToPresetAtScrollOffset(scrollOffset: number) {
    const indexFloat = scrollOffset / (PRESET_WIDTH + 10);
    const index = clamp(round(indexFloat), 0, this.props.presets.length);
    const preset = this.props.presets[index];
    this.scrollToPresetAtIndex(index, preset);
  }

  scrollToPresetAtIndex(index: number, preset: PresetObject) {
    if (!this.scrollView) {
      return;
    }
    this.scrollView.scrollTo({
      x: index * (PRESET_WIDTH + 10),
      animated: true,
    });
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
        scrollEventThrottle={16}
        onScroll={this.onScroll}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
      >
        <View style={styles.leftPadding} />
        {this.props.presets.map((preset, index) => {
          const isSelected = isEqual(preset, this.props.currentPreset);
          return (
            <TouchableOpacity
              key={`${preset.lineStyle}+${preset.textAlignment}`}
              style={styles.captionPresetWrap(isSelected)}
              onPress={() => this.scrollToPresetAtIndex(index, preset)}
            >
              <View style={styles.borderInner}>
                <CaptionPresetStyleView
                  style={styles.captionPreset}
                  textAlignment={preset.textAlignment}
                  lineStyle={preset.lineStyle}
                  wordStyle={preset.wordStyle}
                />
              </View>
              <View style={styles.border(isSelected)}/>
            </TouchableOpacity>
          );
        })}
        <View style={styles.rightPadding} />
      </ScrollView>
    );
  }
}
