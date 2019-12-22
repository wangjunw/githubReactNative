/**
 * 项目启动引导流程之首页
 */
import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
export default class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTab: 'popular',
    };
  }
  changeTab = value => {
    this.setState({
      selectedTab: value,
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <TabNavigator>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'popular'}
            title="最热"
            selectedTitleStyle={{color: 'red'}}
            renderIcon={() => (
              <Image
                source={require('../../static/images/ic_polular.png')}
                style={styles.tabIcon}></Image>
            )}
            renderSelectedIcon={() => (
              <Image
                source={require('../../static/images/ic_polular.png')}
                style={[styles.tabIcon, {tintColor: 'red'}]}></Image>
            )}
            onPress={() => {
              this.changeTab('popular');
            }}>
            <View style={styles.page}>
              <Text>首页</Text>
            </View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'trending'}
            title="趋势"
            selectedTitleStyle={{color: 'red'}}
            renderIcon={() => (
              <Image
                source={require('../../static/images/ic_trending.png')}
                style={styles.tabIcon}></Image>
            )}
            renderSelectedIcon={() => (
              <Image
                source={require('../../static/images/ic_trending.png')}
                style={[styles.tabIcon, {tintColor: 'red'}]}></Image>
            )}
            onPress={() => {
              this.changeTab('trending');
            }}>
            <View style={styles.page}>
              <Text>趋势页</Text>
            </View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'favorite'}
            title="收藏"
            selectedTitleStyle={{color: 'red'}}
            renderIcon={() => (
              <Image
                source={require('../../static/images/ic_favorite.png')}
                style={styles.tabIcon}></Image>
            )}
            renderSelectedIcon={() => (
              <Image
                source={require('../../static/images/ic_favorite.png')}
                style={[styles.tabIcon, {tintColor: 'red'}]}></Image>
            )}
            onPress={() => {
              this.changeTab('favorite');
            }}>
            <View style={styles.page}>
              <Text>收藏页</Text>
            </View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'my'}
            title="我的"
            selectedTitleStyle={{color: 'red'}}
            renderIcon={() => (
              <Image
                source={require('../../static/images/ic_my.png')}
                style={styles.tabIcon}></Image>
            )}
            renderSelectedIcon={() => (
              <Image
                source={require('../../static/images/ic_my.png')}
                style={[styles.tabIcon, {tintColor: 'red'}]}></Image>
            )}
            onPress={() => {
              this.changeTab('my');
            }}>
            <View style={styles.page}>
              <Text>我的</Text>
            </View>
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: 'red',
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
});
