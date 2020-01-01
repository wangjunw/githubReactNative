/**
 * APP全局导航配置
 */
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import DetailPage from '../pages/Detail';

// 初始化导航器，用于加载欢迎页
const InitNavigator = createStackNavigator({
  Welcome: {
    screen: WelcomePage,
    navigationOptions: {
      header: null, //去掉默认的头部导航栏
    },
  },
});

// 主页导航器
const MainNavigator = createStackNavigator({
  Home: {
    screen: HomePage,
    navigationOptions: {
      header: null,
    },
  },
  Detail: {
    screen: DetailPage,
  },
});

/**
 * createSwitchNavigator：不处理返回操作，切换时重置路由状态。适用于从启动欢迎页跳转到首页，首页不能再回到欢迎页的场景
 * createAppContainer：与react组件直接交互的navigation必须包裹起来，MainNavigator等不直接交互的无需包括
 */
export default createAppContainer(
  createSwitchNavigator(
    {
      Init: InitNavigator,
      Main: MainNavigator,
    },
    {
      initialRouteName: 'Init', //首次加载的页面路由名称
      navigationOptions: {
        header: null,
      },
    },
  ),
);
