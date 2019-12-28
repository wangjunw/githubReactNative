/**
 * 项目启动引导流程之欢迎页(广告、轮播图等)
 */
import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';

export default class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.props.navigation.navigate('Home');
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
