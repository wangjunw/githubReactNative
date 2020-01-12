import React, {Component} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../model/TimeSpan';
import {isIPoneX} from '../utils/DeviceUtil';
export const TimeSpans = [
  new TimeSpan('今 天', 'since=daily'),
  new TimeSpan('本 周', 'since=weekly'),
  new TimeSpan('本 月', 'since=monthly'),
];
export default class TrendingDialog extends Component {
  state = {
    visible: false,
  };
  show = () => {
    this.setState({
      visible: true,
    });
  };
  close = () => {
    this.setState({
      visible: false,
    });
  };
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
          }}>
          <MaterialIcons name="arrow-drop-up" size={36} style={styles.arrow} />
          <View style={styles.content}>
            {TimeSpans.map((item, index, arr) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                  }}>
                  <View style={styles.text_container}>
                    <Text style={styles.text}>{item.showText}</Text>
                  </View>
                  {index !== TimeSpans.length - 1 ? (
                    <View style={styles.line}></View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingTop: isIPoneX ? 30 : 0,
  },
  arrow: {
    marginTop: 40,
    color: 'white',
    padding: 0,
    margin: -15,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3,
  },
  text_container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26,
  },
  line: {
    height: 0.3,
    backgroundColor: 'darkgray',
  },
});
