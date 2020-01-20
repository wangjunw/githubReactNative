import React from 'react';
import {View} from 'react-native';
import {THEME_COLOR} from '../../config/config';
import MORE_MENU from '../../config/MORE_MENU';
import GlobalStyles from '../../../static/styles/GlobalStyles';
import ViewUtil from '../../utils/ViewUtil';
import NavigationUtil from '../../utils/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import config from '../../../static/data/config.json';
export default class AboutPage extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about,
      },
      data => this.setState({...data}),
    );
    this.state = {
      data: config,
    };
  }
  toCustomLabel = () => {
    this.props.navigation.navigate('customLabel');
  };
  getItem(menu) {
    return ViewUtil.getMenuItem(
      () => {
        this.onClick(menu);
      },
      menu,
      THEME_COLOR,
    );
  }
  onClick(menu) {
    let RouteName,
      params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebView';
        params.title = '教程';
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutAuthor';
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }
  render() {
    const content = (
      <View>
        {this.getItem(MORE_MENU.Tutorial)}
        <View style={GlobalStyles.line}></View>
        {this.getItem(MORE_MENU.About_Author)}
      </View>
    );
    return this.aboutCommon.render(content, this.state.data.app);
  }
}
