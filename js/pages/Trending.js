/**
 * 趋势页
 */
import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
export default class Trending extends React.Component {
  render() {
    const {navigation} = this.props;
    return (
      <View>
        <Text>目前趋势</Text>
        <Button
          title="改变颜色"
          onPress={() => {
            navigation.setParams({
              theme: {
                tintColor: 'red',
                updateTime: new Date().getTime(),
              },
            });
          }}
        />
      </View>
    );
  }
}
