import React from 'react';
import {StyleSheet, View, FlatList, RefreshControl} from 'react-native';
import {baseUrl} from '../config/config';
import DataRepository from '../expand/dao/DataRepository';
import Repo from './Repo';
const URL = `${baseUrl}/search/repositories?q=`;
const QUERY_STR = '&sort=stars';
export default class ReposList extends React.Component {
  constructor() {
    super();
    this.state = {
      result: [],
      loading: false,
    };
    this.DataRepository = new DataRepository();
  }
  componentWillMount() {
    this.getRepos();
  }
  getRepos = () => {
    this.setState({
      loading: true,
    });
    this.DataRepository.fetchNetRepository(
      URL + this.props.language + QUERY_STR,
    )
      .then(res => {
        this.setState({
          result: res.items,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };
  render() {
    return (
      <View style={styles.repos_list_root}>
        <FlatList
          data={this.state.result}
          renderItem={item => <Repo repoData={item.item} />}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={() => {
                this.getRepos();
              }}
              colors={['#2196f3']}
              tintColor={'#2196f3'}
              title={'loading...'}
              titleColor={'#2196f3'}
            />
          }
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  repos_list_root: {
    flex: 1,
  },
});
