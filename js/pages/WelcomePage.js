/**
 * 项目启动引导流程之欢迎页(广告、轮播图等)
 */
import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
export default class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      NavigationUtil.resetToHomePage({
        navigation: this.props.navigation,
      });
    }, 2000);
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  render() {
    return (
      <View style={styles.welcome_root}>
        <Text>来了老弟!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome_root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
