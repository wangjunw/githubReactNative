import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {baseUrl} from '../config/config';
import DataRepository from '../expand/dao/DataRepository';
// import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
const URL = `${baseUrl}/search/repositories?q=`;
const QUERY_STR = '&sort=stars';
const routeConfig = {};
const tabNavigatorConfig = {
  initialRouteName: 'all',
};
// const TabBar = createMaterialTopTabNavigator(routeConfig, tabNavigatorConfig);
export default class PopularPage extends Component {
  static navigationOptions = {
    title: '最热',
  };
  constructor() {
    super();
    this.state = {
      result: '',
    };
    this.DataRepository = new DataRepository();
  }
  onLoad = () => {
    let url = this.getUrl(this.text);
    this.DataRepository.fetchNetRepository(url)
      .then(res => {
        this.setState({
          result: JSON.stringify(res),
        });
      })
      .catch(err => {
        this.setState({result: JSON.stringify(err)});
      });
  };
  getUrl = key => {
    return URL + key + QUERY_STR;
  };
  render() {
    return (
      <View style={styles.container}>
        {/* <TabBar /> */}
        <Text>册</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
