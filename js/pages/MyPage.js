import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import NavigationBar from '../components/NavigationBar';
import {THEME_COLOR} from '../config/config';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default class My extends React.Component {
  toCustomLabel = () => {
    this.props.navigation.navigate('customLabel');
  };
  getRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {}}>
          <View style={{padding: 5, marginRight: 8}}>
            <Feather name={'search'} size={24} style={{color: 'white'}} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  getLeftButton() {
    return (
      <TouchableOpacity style={{padding: 8, paddingLeft: 12}}>
        <Ionicons name={'ios-arrow-back'} size={26} style={{color: 'white'}} />
      </TouchableOpacity>
    );
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
        rightButton={this.getRightButton()}
        leftButton={this.getLeftButton()}
      />
    );
    return (
      <View>
        {navigationBar}
        <Text onPress={this.toCustomLabel} style={{color: '#6495ed'}}>
          去自定义标签
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
