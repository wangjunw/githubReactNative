/**
 * 关于页面的总配置
 */
import React from 'react';
import BackPressComponent from '../../components/BackPressComponent';
import NavigationUtil from '../../utils/NavigationUtil';
import configJson from '../../../static/data/config.json';
import ParallaxScrollView from 'react-native-parallax-scroll-view'; //背景和布局随滑动变化的头部组件
import {THEME_COLOR} from '../../config/config';
import GlobalStyles from '../../../static/styles/GlobalStyles';
import {
  Platform,
  View,
  Image,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import {android, ios} from '../../config/config';
import {isIPoneX} from '../../utils/DeviceUtil';
import ViewUtil from '../../utils/ViewUtil';
const WINDOW = Dimensions.get('window');
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const TOP = Platform.OS === 'ios' ? 20 + (isIPoneX() ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT =
  Platform.OS === 'ios' ? ios.NAV_BAR_HEIGHT + TOP : android.NAV_BAR_HEIGHT;

export const FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'};

export default class AboutCommon {
  constructor(props, updateState) {
    this.props = props;
    this.updateState = updateState;
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress(),
    });
    this.updateState({
      data: configJson,
    });
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  onBackPress() {
    NavigationUtil.goPage(this.props.navigation);
    return true;
  }
  getParallaxRenderConfig(params) {
    let config = {};
    let avatar =
      typeof params.avatar === 'string' ? {uri: params.avatar} : params.avatar;
    // 静默时的背景图
    config.renderBackground = () => (
      <View key="background">
        <Image
          source={{
            uri: params.backgroundImg,
            width: WINDOW.width,
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: window.width,
            backgroundColor: 'rgba(0,0,0,.4)',
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
      </View>
    );
    // 前景图
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={styles.avatar} source={avatar} />
        <Text style={styles.sectionSpeakerText}>{params.name}</Text>
        <Text style={styles.sectionTitleText}>{params.description}</Text>
      </View>
    );
    // 悬停头部
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );
    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() =>
          NavigationUtil.backToPrevPage(this.props.navigation),
        )}
        {ViewUtil.getShareButton(() => this.onShare())}
      </View>
    );
    return config;
  }
  onShare() {}
  render(contentView, params) {
    const renderConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        backgroundColor={THEME_COLOR}
        contentBackgroundColor={GlobalStyles.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT} //静默时高度
        stickyHeaderHeight={STICKY_HEADER_HEIGHT} //顶部悬浮时的高度
        backgroundScrollSpeed={10}
        {...renderConfig}>
        {contentView}
      </ParallaxScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    alignItems: 'center',
    paddingTop: TOP,
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOP,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100,
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
  },
});
