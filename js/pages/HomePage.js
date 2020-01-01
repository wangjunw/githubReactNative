/**
 * 项目启动引导流程之首页
 */
import React, {Component} from 'react';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicBottomTabNavigator from '../navigator/DynamicBottomTabNavigator';
export default class HomePage extends Component {
  render() {
    // 保存外层的navigation(即与HomePage同级设置的路由)，用于在子页面中跳转
    NavigationUtil.navigation = this.props.navigation;
    return <DynamicBottomTabNavigator />;
  }
}
