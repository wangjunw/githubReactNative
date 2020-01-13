/**
 * 项目列表组件
 */
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationUtil from '../utils/NavigationUtil';
export default class Repo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {repoData} = this.props;
    let favoriteButton = (
      <TouchableOpacity style={{padding: 6}} onPress={() => {}}>
        <FontAwesome name="star-o" size={26} style={{color: 'red'}} />
      </TouchableOpacity>
    );
    if (!repoData || !repoData.owner) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.repo_root}
        onPress={() => {
          NavigationUtil.goPage({projectModel: repoData}, 'Detail');
        }}>
        <View style={styles.cell}>
          <Text style={styles.title}>{repoData.full_name}</Text>
          <Text style={styles.description}>{repoData.description}</Text>
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
                source={{uri: repoData.owner_avatar_url}}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Stars:</Text>
              <Text>{repoData.stargazers_count}</Text>
            </View>
            {favoriteButton}
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
