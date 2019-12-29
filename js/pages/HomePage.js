/**
 * 项目启动引导流程之首页
 */
import React from 'react';
// import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import PopularPage from '../pages/PopularPage';
import MyPage from './my/Index';
import TrendingPage from '../pages/Trending';
import FavoritePage from '../pages/Favorite';
import Ionicons from 'react-native-vector-icons/AntDesign';
const RouteConfig = {
  popular: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons name={'Trophy'} size={26} style={{color: tintColor}} />
      ),
    },
  },
  trending: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons name={'linechart'} size={26} style={{color: tintColor}} />
      ),
    },
  },
  favorite: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons name={'hearto'} size={26} style={{color: tintColor}} />
      ),
    },
  },
  my: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: '我的',
      showLabel: true,
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons name={'user'} size={26} style={{color: tintColor}} />
      ),
    },
  },
};

const BottomTabNavigatorConfig = {
  activeTintColor: 'red', //选中的标签颜色
  initialRouteName: 'popular',
  showIcon: true,
  barStyle: {
    backgroundColor: '#fff',
  },
};
export default createBottomTabNavigator(RouteConfig, BottomTabNavigatorConfig);
