/**
 * APP全局导航配置
 */
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {connect} from 'react-redux';
import {
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';
import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import DetailPage from '../pages/Detail';
import WebViewPage from '../pages/WebViewPage';
import AboutPage from '../pages/about/AboutPage';
import AboutAuthorPage from '../pages/about/AboutAuthor';
import CustomKeyPage from '../pages/CustomKeyPage';
export const rootCom = 'Init'; //定义根路由

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
    navigationOptions: {
      header: null,
    },
  },
  WebView: {
    screen: WebViewPage,
    navigationOptions: {
      header: null,
    },
  },
  About: {
    screen: AboutPage,
    navigationOptions: {
      header: null,
    },
  },
  AboutAuthor: {
    screen: AboutAuthorPage,
    navigationOptions: {
      header: null,
    },
  },
  CustomKey: {
    screen: CustomKeyPage,
    navigationOptions: {
      header: null,
    },
  },
});

/**
 * createSwitchNavigator：不处理返回操作，切换时重置路由状态。适用于从启动欢迎页跳转到首页，首页不能再回到欢迎页的场景
 * createAppContainer：与react组件直接交互的navigation必须包裹起来，MainNavigator等不直接交互的无需包括
 */
export const RootNavigator = createAppContainer(
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
// 初始化中间件
export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
  'root',
);

/**
 * 将根导航器组件传递给createReduxContainer
 * 要在createReactNavigationReduxMiddleware之后执行
 */
const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

// 创建state到props
const mapStateToProps = state => ({
  state: state.nav,
});
// 连接react组件与redux
export default connect(mapStateToProps)(AppWithNavigationState);
