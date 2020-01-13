/**
 * 详情页
 */
import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import NavigationBar from '../components/NavigationBar';
import NavigationUtil from '../utils/NavigationUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {THEME_COLOR, TRENDING_BASE_URL} from '../config/config';
import ViewUtil from '../utils/ViewUtil';
import {isIPoneX} from '../utils/DeviceUtil';
import BackPressComponent from '../components/BackPressComponent';
export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel} = this.params;
    this.url =
      projectModel.html_url || TRENDING_BASE_URL + projectModel.fullName;
    const title = projectModel.full_name || projectModel.fullName;
    this.state = {
      title,
      url: this.url,
      canGoBack: false, //详情页webview中的返回上一级
    };
    this.backPress = new BackPressComponent({backPress: this.onBackPress});
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
  renderRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {}}>
          <FontAwesome
            name={'star-o'}
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
    let navigationBar = (
      <NavigationBar
        title={this.state.title}
        leftButton={ViewUtil.getLeftBackButton(this.onBack)}
        style={{backgroundColor: THEME_COLOR}}
        titleLayoutStyle={titleLayoutStyle}
        rightButton={this.renderRightButton()}
      />
    );
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={web => (this.webView = web)}
          startInLoadingState={true}
          onNavigationStateChange={e => {
            this.onNavigationStateChange(e);
          }}
          source={{uri: this.state.url}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: isIPoneX() ? 30 : 0,
  },
});
