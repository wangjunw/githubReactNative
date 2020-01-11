/**
 * 趋势列表组件
 */
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HtmlView from 'react-native-htmlview'; //转换html字符串
export default class TrendingRepo extends React.Component {
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
    if (!repoData) {
      return null;
    }
    let description = 'p' + repoData.description + '</p>';
    return (
      <TouchableOpacity style={styles.repo_root}>
        <View style={styles.cell}>
          <Text style={styles.title}>{repoData.fullName}</Text>
          <HtmlView
            value={description}
            onLinkPress={url => {}}
            stylesheet={{
              p: styles.description,
              a: styles.description,
            }}
          />
          <Text style={styles.description}>{repoData.meta}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Built by:</Text>
              {repoData.contribution.map((item, index, arr) => {
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
              <Text>{repoData.starCount}</Text>
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
