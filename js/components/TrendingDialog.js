import React, {Component} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
export default class TrendingDialog extends Component {
  state = {
    visible: false,
  };
  show() {
    this.setState({
      visible: true,
    });
  }
  close() {
    this.setState({
      visible: false,
    });
  }
  render() {
    const {onClose, onSelect} = this.props;
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          onClose();
        }}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => {
            this.close();
          }}></TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
