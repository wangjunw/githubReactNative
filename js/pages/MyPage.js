import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import NavigationBar from '../components/NavigationBar';
import {THEME_COLOR} from '../config/config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MORE_MENU from '../config/MORE_MENU';
import GlobalStyles from '../../static/styles/GlobalStyles';
import ViewUtil from '../utils/ViewUtil';
import NavigationUtil from '../utils/NavigationUtil';
export default class My extends React.Component {
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
      case MORE_MENU.About:
        RouteName = 'About';
        break;
      case MORE_MENU.Tutorial:
        RouteName = 'WebView';
        params.title = '教程';
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }
  render() {
    let statusBarStyle = {
      backgroundColor: THEME_COLOR,
    };
    let navigationBar = (
      <NavigationBar
        title={'我的'}
        statusBar={statusBarStyle}
        style={{backgroundColor: THEME_COLOR}}
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
                style={{marginRight: 10, color: THEME_COLOR}}
              />
              <Text>Github Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={24}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: THEME_COLOR,
              }}
            />
          </TouchableOpacity>
          <View style={GlobalStyles.line}></View>
          {this.getItem(MORE_MENU.Tutorial)}
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
          {/*关于作者*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.About_Author)}
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
