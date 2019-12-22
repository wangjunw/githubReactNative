/**
 * 项目启动引导流程之初始化配置页
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import WelcomePage from './js/pages/WelcomePage';
export default class App extends React.Component {
  renderScene(route, navigator) {
    let Component = route.component;
    return <Component {...route.params} navigator={navigator} />;
  }
  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{component: WelcomePage}}
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
