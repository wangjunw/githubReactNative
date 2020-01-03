/**
 * 项目启动引导流程之初始化配置页
 */
import React from 'react';
import {Provider} from 'react-redux';
import AppNavigator from './js/navigator/AppNavigator';
import store from './js/store';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}
