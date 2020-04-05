/**
 * 详情页
 */
import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import NavigationBar from '../components/NavigationBar';
import NavigationUtil from '../utils/NavigationUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TRENDING_BASE_URL} from '../config/config';
import ViewUtil from '../utils/ViewUtil';
import {isIPoneX} from '../utils/DeviceUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import BackPressComponent from '../components/BackPressComponent';
import SafeAreaViewPlus from '../components/SafeAreaViewPlus';
export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel, flag} = this.params;
    const {item, isFavorite} = projectModel;
    this.favoriteDao = new FavoriteDao(flag);
    this.url = item.html_url || TRENDING_BASE_URL + item.fullName;
    const title = item.full_name || item.fullName;
    this.state = {
      title,
      url: this.url,
      canGoBack: false, //详情页webview中的返回上一级
      isFavorite,
    };
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress(),
    });
  }
  onBackPress() {
    this.onBack();
    return true;
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  onBack() {
    // 如果可以返回webview的上一页
    if (this.state.canGoBack) {
      this.webView.goBack();
    }
    // 否则就返回程序的上一页
    else {
      NavigationUtil.backToPrevPage(this.props.navigation);
    }
  }
  _onFavoriteClick() {
    const {projectModel, callback} = this.params;
    const isFavorite = (projectModel.isFavorite = !projectModel.isFavorite);
    callback(isFavorite);
    this.setState({
      isFavorite,
    });
    let key = projectModel.item.fullName
      ? projectModel.item.fullName
      : projectModel.item.id.toString();
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }
  renderRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            this._onFavoriteClick();
          }}>
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{color: 'white', marginRight: 10}}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(() => {})}
      </View>
    );
  }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    });
  }
  render() {
    const titleLayoutStyle =
      this.state.title.length > 20 ? {paddingRight: 30} : null;
    const {theme} = this.params;

    let navigationBar = (
      <NavigationBar
        title={this.state.title}
        leftButton={ViewUtil.getLeftBackButton(() => {
          this.onBack();
        })}
        style={theme.styles.navBar}
        titleLayoutStyle={titleLayoutStyle}
        rightButton={this.renderRightButton()}
      />
    );

    return (
      <SafeAreaViewPlus topColor={theme.themeColor}>
        {navigationBar}
        <WebView
          ref={(webView) => {
            this.webView = webView;
          }}
          startInLoadingState={true}
          source={{uri: this.state.url}}
          onNavigationStateChange={(e) => {
            this.onNavigationStateChange(e);
          }}
        />
      </SafeAreaViewPlus>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: isIPoneX() ? 30 : 0,
  },
});
