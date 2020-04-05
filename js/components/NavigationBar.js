import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  View,
  ViewPropTypes,
  Text,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';

import {ios, android} from '../config/config';
import {isIPoneX} from '../utils/DeviceUtil';

// 状态栏属性
const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
};
export default class NavigationBar extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape), //状态栏
    rightButton: PropTypes.element,
    leftButton: PropTypes.element,
  };
  // 设置默认属性
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
    },
  };
  // 封装一层，让按钮样式可控制
  getButtonElement(button) {
    return <View style={styles.navBarButton}>{button ? button : null}</View>;
  }
  render() {
    // 状态栏
    let statusBar = !this.props.statusBar.hidden ? (
      <View style={styles.statusBar}>
        <StatusBar {...this.props.statusBar} />
      </View>
    ) : null;
    // 导航栏中间标题，ellipsizeMode：超出文本省略号显示设置，numberOfLines：设置行数
    let titleView = this.props.titleView ? (
      this.props.titleView
    ) : (
      <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>
        {this.props.title}
      </Text>
    );
    // 导航栏主体
    let content = this.props.hide ? null : (
      <View style={styles.navBar}>
        {this.getButtonElement(this.props.leftButton)}
        <View
          style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
          {titleView}
        </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>
    );
    return (
      <View style={[styles.container, this.props.style]}>
        {statusBar}
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196f3',
  },
  statusBar: {
    height: isIPoneX()
      ? 0
      : Platform.OS === 'ios'
      ? ios.STATUS_BAR_HEIGHT
      : android.STATUS_BAR_HEIGHT,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? ios.NAV_BAR_HEIGHT : android.NAV_BAR_HEIGHT,
  },
  navBarButton: {
    alignItems: 'center',
  },
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
});
