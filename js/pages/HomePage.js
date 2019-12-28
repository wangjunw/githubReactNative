/**
 * 项目启动引导流程之首页
 */
import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import PopularPage from '../pages/PopularPage';
import MyPage from '../pages/MyPage';
const RouteConfig = {
  popular: PopularPage,
  my: MyPage,
};

const MaterialBottomTabNavigatorConfig = {
  activeColor: 'red',
  initialRouteName: 'popular',
};
export default createMaterialBottomTabNavigator(
  RouteConfig,
  MaterialBottomTabNavigatorConfig,
);
