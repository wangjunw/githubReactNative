/**
 * 底部Tab动态配置
 */
import React, {Component} from 'react';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import PopularPage from '../pages/PopularPage';
import MyPage from '../pages/my/Index';
import TrendingPage from '../pages/Trending';
import FavoritePage from '../pages/Favorite';
import Ionicons from 'react-native-vector-icons/AntDesign';
import {createAppContainer} from 'react-navigation';

const TABS = {
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
export default class DynamicTabNavigator extends Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true; //消除黄色警告
  }

  _TabNavigator = () => {
    const {popular, trending, favorite, my} = TABS; //获取所有Tab配置
    const tabs = {popular, trending, favorite, my}; //根据需要动态配置要显示的Tab
    popular.navigationOptions.tabBarLabel = '最热'; //根据需要修改配置属性
    return createAppContainer(
      createBottomTabNavigator(tabs, {
        initialRouteName: 'popular',
        tabBarComponent: TabBarComponent,
      }),
    );
  };
  render() {
    const Tab = this._TabNavigator();
    return <Tab />;
  }
}

/**
 * 对底部TabBar组件做一层封装，让其可以配置
 */
class TabBarComponent extends Component {
  constructor(props) {
    super(props);
    this.theme = {
      tintColor: props.activeTintColor, //图标个字体颜色
      updateTime: new Date().getTime(), //更新时间，做标记与样式无关
    };
  }
  render() {
    // 获取所有路由和当前路由索引
    const {routes, index} = this.props.navigation.state;
    // setParams的数据存在设置setParams的路由的state中
    if (routes[index].params) {
      const {theme} = routes[index].params;
      // 以最新的更新时间为主，防止被其他tab之前的修改覆盖掉
      if (theme && theme.updateTime > this.theme.updateTime) {
        this.theme = theme;
      }
    }
    return (
      <BottomTabBar
        {...this.props}
        activeTintColor={this.theme.tintColor || this.props.activeTintColor}
      />
    );
  }
}
