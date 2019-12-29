import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
export default class My extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '我的',
    };
  };
  toCustomLabel = () => {
    this.props.navigation.navigate('customLabel');
  };
  render() {
    return (
      <View>
        <Text onPress={this.toCustomLabel} style={{color: '#6495ed'}}>
          去自定义标签
        </Text>
      </View>
    );
  }
}
