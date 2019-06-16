// @flow
/* eslint react/prop-types: 0, react/display-name: 0, flowtype/generic-spacing: 0 */
import React from 'react';
import { View, Dimensions } from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

import BottomSheetModal from '../../../../components/bottom-sheet-modal/BottomSheetModal';
import { UI_COLORS } from '../../../../constants';
import * as Color from '../../../../utils/Color';

import { AlbumGrid } from '../AlbumGrid';

import type { SFC } from '../../../../types/react';

export type AlbumExplorerModalProps = {
  isVisible: boolean,
  onRequestDismiss: () => void,
};

const SafeAreaView = withSafeArea(View, 'padding', 'vertical');

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  flex: {
    flex: 1,
  },
  fill: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: Color.hexToRgbaString(UI_COLORS.DARK_GREY, 0.5),
  },
  test: {
    flex: 1,
    backgroundColor: 'red'
  }
};

export const AlbumExplorerModal: SFC<
  AlbumExplorerModalProps
> = ({
  isVisible,
  onRequestDismiss
}) => {
  return (
    <BottomSheetModal
      isVisible={isVisible}
      onRequestDismissModal={onRequestDismiss}
    >
      <View style={styles.fill}>
        {isVisible ? (
          <SafeAreaView style={styles.flex}>          
            <AlbumGrid
              onSelectAlbum={() => { /* TODO */}}
            />
          </SafeAreaView>
        ) : null}
      </View>
    </BottomSheetModal>
  );
};
