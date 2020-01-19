/**
 * 详情页
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import NavigationBar from '../components/NavigationBar';
import NavigationUtil from '../utils/NavigationUtil';
import {THEME_COLOR} from '../config/config';
import ViewUtil from '../utils/ViewUtil';
import {isIPoneX} from '../utils/DeviceUtil';
import BackPressComponent from '../components/BackPressComponent';
import GlobalStyles from '../config/GlobalStyles';
export default class WebViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {title, url} = this.params;
    this.state = {
      title: title,
      url: url,
      canGoBack: false,
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

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    });
  }
  render() {
    let navigationBar = (
      <NavigationBar
        title={this.state.title}
        leftButton={ViewUtil.getLeftBackButton(() => {
          this.onBackPress();
        })}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <WebView
          ref={webView => {
            this.webView = webView;
          }}
          startInLoadingState={true}
          source={{uri: this.state.url}}
          onNavigationStateChange={e => {
            this.onNavigationStateChange(e);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: isIPoneX() ? 30 : 0,
  },
});
