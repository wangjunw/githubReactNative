import React, {Component} from 'react';
import {Text, StyleSheet, View, Image, TextInput} from 'react-native';
import NavigationBar from '../components/NavigationBar';
import {baseUrl} from '../config/config';
import DataRepository from '../expand/dao/DataRepository';
const URL = `${baseUrl}/search/repositories?q=`;
const QUERY_STR = '&sort=stars';
export default class PopularPage extends Component {
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
    alert(URL + key + QUERY_STR);
    return URL + key + QUERY_STR;
  };
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar title="最热" />
        <TextInput
          style={{height: 20, borderWidth: 1, fontSize: 16}}
          onChangeText={text => (this.text = text)}
        />
        <Text
          onPress={() => {
            this.onLoad();
          }}>
          获取数据
        </Text>
        <Text>{this.state.result}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
