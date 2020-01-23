/**
 * 项目启动引导流程之首页
 */
import React, {Component} from 'react';
import NavigationUtil from '../utils/NavigationUtil';
import DynamicBottomTabNavigator from '../navigator/DynamicBottomTabNavigator';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import BackPressComponent from '../components/BackPressComponent';
import CustomTheme from '../pages/CustomTheme';
import {View} from 'react-native';
import actions from '../action';
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.backPress = new BackPressComponent({backPress: this.onBackPress});
  }
  /**
   * 处理安卓机的物理返回键，如果不是首页返回上一层
   * 默认情况，点击返回键就退出应用
   */
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  onBackPress = () => {
    const {dispatch, nav} = this.props;
    /**
     * 因为MainNavigator在RootNavigator的位置为1
     * 然后当MainNavigator的index为0时（即在首页，没有可以再后退的页面）点击返回键才退出，
     */
    if (nav.routes[1].index === 0) {
      return false;
    }
    // 否则都是返回上一个路由
    dispatch(NavigationActions.back());
    return true;
  };
  renderCustomThemeView() {
    const {customThemeViewVisible, onShowCustomThemeView} = this.props;
    return (
      <CustomTheme
        visible={customThemeViewVisible}
        {...this.props}
        onClose={() => {
          onShowCustomThemeView(false);
        }}
      />
    );
  }
  render() {
    // 保存外层的navigation(即与HomePage同级设置的路由)，用于在子页面中跳转到外层页面
    NavigationUtil.navigation = this.props.navigation;
    return (
      <View style={{flex: 1}}>
        <DynamicBottomTabNavigator />
        {this.renderCustomThemeView()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  customThemeViewVisible: state.theme.customThemeViewVisible,
});
const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: show => dispatch(actions.onShowCustomThemeView(show)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
