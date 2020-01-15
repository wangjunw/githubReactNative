/**
 * 趋势列表组件
 */
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import HtmlView from 'react-native-htmlview'; //转换html字符串
import BaseItem from '../components/BaseItem';
export default class TrendingRepo extends BaseItem {
  constructor(props) {
    super(props);
  }
  render() {
    const {projectModel} = this.props;
    const {item} = projectModel;
    if (!item) {
      return null;
    }
    let description = 'p' + item.description + '</p>';
    return (
      <TouchableOpacity
        style={styles.repo_root}
        onPress={() => this.onItemClick()}>
        <View style={styles.cell}>
          <Text style={styles.title}>{item.fullName}</Text>
          <HtmlView
            value={description}
            onLinkPress={url => {}}
            stylesheet={{
              p: styles.description,
              a: styles.description,
            }}
          />
          <Text style={styles.description}>{item.meta}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Built by:</Text>
              {item.contribution.map((item, index, arr) => {
                return (
                  <Image
                    key={index}
                    style={{width: 22, height: 22, margin: 2}}
                    source={{uri: arr[i]}}
                  />
                );
              })}
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Stars:</Text>
              <Text>{item.starCount}</Text>
            </View>
            {this._favoriteIcon()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  repo_root: {
    flex: 1,
  },
  cell: {
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderWidth: 0.5,
    borderColor: '#dddddd',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  },
  starIcon: {
    width: 22,
    height: 22,
  },
});
