import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, Platform, StatusBar} from 'react-native';
import propTypes from 'prop-types';
const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = 20;

// 顶部状态栏参数
const StatusBarShape = {
  backgroundColor: propTypes.string,
  barStyle: propTypes.oneOf(['default', 'dark-content', 'light-content']),
  hidden: propTypes.bool,
};
export default class NavigationBar extends Component {
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
    },
  };
  static propTypes = {
    style: propTypes.style,
    title: propTypes.string,
    titleView: propTypes.element,
    hide: propTypes.bool,
    leftButton: propTypes.element,
    rightButton: propTypes.element,
    statusBar: propTypes.shape(StatusBarShape),
  };
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      hide: false,
    };
  }
  render() {
    let status = (
      <View style={([styles.statusBar], this.props.statusBar)}>
        <StatusBar {...this.props.statusBar} />
      </View>
    );
    let titleView = this.props.titleView ? (
      this.props.titleView
    ) : (
      <Text style={styles.title}>{this.props.title}</Text>
    );
    let content = (
      <View style={styles.navBar}>
        {this.props.leftButton}
        <View style={styles.titleContainer}>{titleView}</View>
        {this.props.rightButton}
      </View>
    );
    return (
      <View style={[styles.container, this.props.style]}>
        {status}
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    backgroundColor: 'red',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
  },
});
