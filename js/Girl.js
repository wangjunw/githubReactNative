import React from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from './components/NavigationBar';
export default class Girl extends React.Component {
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
          title="女孩子"
          style={{backgroundColor: '#ee6363'}}
          leftButton={
            <TouchableOpacity
              onPress={() => {
                this.props.navigator.pop();
              }}>
              <Image
                style={styles.iconButton}
                source={require('../static/images/ic_arrow_back_white_36pt.png')}></Image>
            </TouchableOpacity>
          }
          rightButton={
            <TouchableOpacity>
              <Image
                style={styles.iconButton}
                source={require('../static/images/ic_star.png')}></Image>
            </TouchableOpacity>
          }
        />
        <Text>我是女孩页面</Text>
        <Text
          onPress={() => {
            this.props.callBackHandler('大白兔奶糖');
            this.props.navigator.pop();
          }}>
          回赠一块糖吧
        </Text>
        <Text>我收到男孩送的{this.props.word}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  iconButton: {
    width: 22,
    height: 22,
    margin: 5,
  },
});
