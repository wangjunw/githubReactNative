import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from './components/NavigationBar';
import Girl from './Girl';
export default class Boy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: '',
    };
  }
  render() {
    return (
      <View>
        <NavigationBar
          title="Boy"
          statusBar={{
            backgroundColor: 'red',
          }}
        />
        <Text>我是男孩页面</Text>
        <Text
          onPress={() => {
            this.props.navigator.push({
              component: Girl,
              params: {
                word: '玫瑰玫瑰',
                callBackHandler: word => {
                  this.setState({
                    word,
                  });
                },
              },
            });
          }}>
          点我去女孩家里送花花
        </Text>
        <Text>我从女孩家里带来了{this.state.word}</Text>
      </View>
    );
  }
}
