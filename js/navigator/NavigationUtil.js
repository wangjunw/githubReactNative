/**
 * 全局导航跳转工具类
 */
export default class NavigationUtil {
  // 返回上一页
  static backToPrevPage(navigation) {
    navigation.goBack();
  }
  //跳转到指定页面
  static goPage(params, page) {
    // 使用外层的navigation，跳转外层路由
    const navigation = NavigationUtil.navigation;
    if (!navigation) {
      alert('页面不存在');
      return;
    }
    navigation.navigate(page, {...params});
  }
  //重置跳转回到首页
  static resetToHomePage(params) {
    const {navigation} = params;
    navigation.navigate('Main');
  }
}
