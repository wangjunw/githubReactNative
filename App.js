/**
 * 项目启动引导流程之初始化配置页
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import WelcomePage from './js/pages/WelcomePage';
import HomePage from './js/pages/HomePage';
const AppNavigator = createAppContainer(
  createStackNavigator(
    {
      Home: HomePage,
      Welcome: WelcomePage,
    },
    {
      initialRouteName: 'Welcome', //初始渲染页面
      headerMode: 'none', //去掉默认的头部导航栏
    },
  ),
);

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <AppNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
