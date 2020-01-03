import {combineReducers} from 'redux';
import theme from './theme';
import {RootNavigator, rootCom} from '../navigator/AppNavigator';

// 创建默认state
const navState = RootNavigator.router.getStateForAction(
  RootNavigator.router.getActionForPathAndParams(rootCom), //把定义的根路由传入
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
});

export default indexReducer;
