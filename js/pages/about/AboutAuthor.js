import React from 'react';
import {View, Clipboard} from 'react-native';
import {THEME_COLOR} from '../../config/config';
import GlobalStyles from '../../../static/styles/GlobalStyles';
import ViewUtil from '../../utils/ViewUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtil from '../../utils/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import config from '../../../static/data/config.json';
import Toast from 'react-native-easy-toast';
export default class AboutPage extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about_me,
      },
      data => this.setState({...data}),
    );
    this.state = {
      data: config,
      showBlog: true,
      showContact: false,
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
  onClick(item) {
    if (!item) {
      return;
    }
    if (item.url) {
      NavigationUtil.goPage(
        {
          title: item.title,
          url: item.url,
        },
        'WebView',
      );
      return;
    }
    if (item.account) {
      Clipboard.setString(item.account);
      this.refs.toast.show(item.title + item.account + '已经复制到剪贴板');
    }
  }
  _item(menu, isShow, key) {
    return ViewUtil.getSettingItem(
      () => {
        this.setState({
          [key]: !this.state[key],
        });
      },
      menu.name,
      THEME_COLOR,
      Ionicons,
      menu.icon,
      isShow ? 'ios-arrow-up' : 'ios-arrow-down',
    );
  }
  // 展开的子列表
  renderItems(dic, isShowAccount) {
    if (!dic) {
      return false;
    }
    let views = [];
    for (let i in dic) {
      let title = isShowAccount
        ? dic[i].title + ':' + dic[i].account
        : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(
            () => {
              this.onClick(dic[i]);
            },
            title,
            THEME_COLOR,
          )}
          <View style={GlobalStyles.line}></View>
        </View>,
      );
    }
    return views;
  }
  render() {
    const content = (
      <View>
        {this._item(
          this.state.data.aboutMe.Blog,
          this.state.showBlog,
          'showBlog',
        )}
        <View style={GlobalStyles.line} />
        {this.state.showBlog
          ? this.renderItems(this.state.data.aboutMe.Blog.items)
          : null}

        {this._item(
          this.state.data.aboutMe.Contact,
          this.state.showContact,
          'showContact',
        )}
        <View style={GlobalStyles.line} />
        {this.state.showContact
          ? this.renderItems(this.state.data.aboutMe.Contact.items, true)
          : null}
      </View>
    );
    return (
      <View style={{flex: 1}}>
        {this.aboutCommon.render(content, this.state.data.author)}
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}
