/**
 * 底部Tab动态配置
 */
import React, {Component} from 'react';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import PopularPage from '../pages/PopularPage';
import MyPage from '../pages/MyPage';
import TrendingPage from '../pages/Trending';
import FavoritePage from '../pages/Favorite';
import Ionicons from 'react-native-vector-icons/AntDesign';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';

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
class DynamicTabNavigator extends Component {
  constructor(props) {
    super(props);
  }

  _TabNavigator = () => {
    // 如果已经创建过就直接返回，解决每次更改state都重置tab
    if (this.Tabs) {
      return this.Tabs;
    }
    const {popular, trending, favorite, my} = TABS; //获取所有Tab配置
    const tabs = {popular, trending, favorite, my}; //根据需要动态配置要显示的Tab
    popular.navigationOptions.tabBarLabel = '最热'; //根据需要修改配置属性
    return (this.Tabs = createAppContainer(
      createBottomTabNavigator(tabs, {
        initialRouteName: 'popular',
        tabBarComponent: props => (
          <TabBarComponent {...props} theme={this.props.theme} />
        ),
      }),
    ));
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
  }
  render() {
    return <BottomTabBar {...this.props} activeTintColor={this.props.theme} />;
  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme,
});
export default connect(mapStateToProps)(DynamicTabNavigator);
