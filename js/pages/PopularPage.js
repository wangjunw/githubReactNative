import React, {Component} from 'react';

import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {View, Text, StyleSheet} from 'react-native';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';

// tab对应的组件
class PopularTabView extends Component {
  render() {
    const {tabLabel} = this.props;
    return (
      <View>
        <Text>{tabLabel}</Text>
        <Text
          onPress={() => {
            NavigationUtil.goPage(
              {navigation: this.props.navigation},
              'Detail',
            );
          }}>
          跳转到详情
        </Text>
      </View>
    );
  }
}
export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'iOS', 'React', 'React Native'];
  }
  _getTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabView {...props} tabLabel={item} />, //返回组件可以传递函数
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }
  render() {
    const TopNavigator = createAppContainer(
      createMaterialTopTabNavigator(this._getTabs(), {
        lazy: true,
        scrollEnabled: true,
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false, //标签不大写
          scrollEnabled: true, //选项卡左右可滑动
          style: {
            backgroundColor: '#678',
          },
          indicatorStyle: styles.indicatorStyle, // 指示器样式(tab下的横线)
          labelStyle: styles.labelStyle, // 文字的样式
        },
      }),
    );
    return <TopNavigator />;
  }
}

const styles = StyleSheet.create({
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    backgroundColor: '#fff',
    height: 2,
  },
  labelStyle: {
    fontSize: 13,
    marginBottom: 6,
    marginTop: 6,
  },
});
