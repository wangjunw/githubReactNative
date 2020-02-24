import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import NavigationBar from '../components/NavigationBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MORE_MENU from '../config/MORE_MENU';
import GlobalStyles from '../../static/styles/GlobalStyles';
import ViewUtil from '../utils/ViewUtil';
import NavigationUtil from '../utils/NavigationUtil';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import {connect} from 'react-redux';
import actions from '../action';
class My extends Component {
  constructor(props) {
    super(props);
  }
  toCustomLabel = () => {
    this.props.navigation.navigate('customLabel');
  };
  getItem(menu) {
    const {theme} = this.props;
    return ViewUtil.getMenuItem(
      () => {
        this.onClick(menu);
      },
      menu,
      theme.themeColor,
    );
  }
  onClick(menu) {
    let RouteName,
      params = {};
    switch (menu) {
      case MORE_MENU.About:
        RouteName = 'About';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutAuthor';
        break;
      case MORE_MENU.Feedback:
        const url = 'mailto://junweiw811@gmail.com';
        // 是否可以打开其他应用
        Linking.canOpenURL(url)
          .then(support => {
            if (!support) {
              console.log('do not open email');
            } else {
              Linking.openURL(url);
            }
          })
          .catch(e => {
            console.error(e);
          });
        break;
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKey';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag =
          menu !== MORE_MENU.Custom_Language
            ? FLAG_LANGUAGE.flag_key
            : FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Sort_Key:
        RouteName = 'SortKey';
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKey';
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Custom_Theme:
        const {onShowCustomThemeView} = this.props;
        onShowCustomThemeView(true);
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }
  render() {
    const {theme} = this.props;
    let statusBarStyle = {
      backgroundColor: theme.themeColor,
    };
    let navigationBar = (
      <NavigationBar
        title={'我的'}
        statusBar={statusBarStyle}
        style={theme.styles.navBar}
      />
    );
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.onClick(MORE_MENU.About);
            }}>
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{marginRight: 10, color: theme.themeColor}}
              />
              <Text>Github Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={24}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: theme.themeColor,
              }}
            />
          </TouchableOpacity>
          <View style={GlobalStyles.line}></View>
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*语言排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GlobalStyles.line} />
          {/*反馈*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  theme: state.theme.theme,
});
const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: show => {
    return dispatch(actions.onShowCustomThemeView(show));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(My);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  about_left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray',
  },
});
