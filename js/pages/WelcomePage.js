/**
 * 项目启动引导流程之欢迎页(广告、轮播图等)
 */
import React, {Component} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';

import HomePage from './HomePage';

export default class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.props.navigator.resetTo({
        component: HomePage,
      });
    }, 2000);
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  render() {
    return (
      <View>
        <Text>来了老弟!</Text>
      </View>
    );
  }
}
