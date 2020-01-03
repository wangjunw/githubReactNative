/**
 * 收藏页
 */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Text} from 'react-native';
import actions from '../action/index';
class Favorite extends React.Component {
  render() {
    return (
      <View>
        <Text
          onPress={() => {
            this.props.onThemeChange('red');
          }}>
          目前趋势
        </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  test: '333',
});
const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Favorite);
