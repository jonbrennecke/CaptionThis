// @flow
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import type { Style, Children } from '../../types/react';
import type { Size } from '../../types/media';

type Props = {
  style?: ?Style,
  renderChildren: Size => Children,
};

type State = {
  viewSize: Size,
};

const styles = {
  container: {},
};

// $FlowFixMe
@autobind
export class MeasureContentsView extends PureComponent<Props, State> {
  state = {
    viewSize: { width: 0, height: 0 },
  };

  viewDidLayout({ nativeEvent: { layout } }: any) {
    this.setState({
      viewSize: { height: layout.height, width: layout.width },
    });
  }

  render() {
    return (
      <View
        onLayout={this.viewDidLayout}
        style={[styles.container, this.props.style]}
        pointerEvents="box-none"
      >
        {this.props.renderChildren(this.state.viewSize)}
      </View>
    );
  }
}
