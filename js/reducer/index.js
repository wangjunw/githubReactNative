import {combineReducers} from 'redux';
import theme from './theme';
import popular from './popular/index';
import {RootNavigator, rootCom} from '../navigator/AppNavigator';

/**
 * 创建默认state
 * getStateForAction：定义navigation state以响应给定的操作。 比如当一个动作被传递到props.navigation.dispatch时
 */
const navState = RootNavigator.router.getStateForAction(
  //返回用户导航到路由时应使用的可选导航操作，并提供可选的查询参数
  RootNavigator.router.getActionForPathAndParams(rootCom),
);

// 创建自己的navigationReducer
const navReducer = (state = navState, action) => {
  const nextState = RootNavigator.router.getStateForAction(action, state);
  // 如果nextState为null或者未定义，只返回初始state
  return nextState || state;
};

// 合并reducer
const indexReducer = combineReducers({
  nav: navReducer,
  theme,
  popular,
});

export default indexReducer;
