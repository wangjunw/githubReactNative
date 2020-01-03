/**
 * 趋势页
 */
import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
class Trending extends React.Component {
  render() {
    const {navigation} = this.props;
    return (
      <View>
        <Text>目前趋势</Text>
        <Button
          title="改变颜色"
          onPress={() => {
            this.props.onThemeChange('yellow');
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  test: '22',
});
const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Trending);
