/**
 * 项目列表组件
 */
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
export default class Repo extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <TouchableOpacity style={styles.repo_root}>
        <View style={styles.cell}>
          <Text style={styles.title}>{this.props.repoData.full_name}</Text>
          <Text style={styles.description}>
            {this.props.repoData.description}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Author:</Text>
              <Image
                style={{width: 22, height: 22}}
                source={{uri: this.props.repoData.owner_avatar_url}}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Stars:</Text>
              <Text>{this.props.repoData.stargazers_count}</Text>
            </View>
            <Image
              source={require('../../static/images/ic_star.png')}
              style={styles.starIcon}
            />
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
