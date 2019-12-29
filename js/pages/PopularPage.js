import React from 'react';

import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import ReposList from '../components/ReposList';

function AllRepos() {
  return <ReposList language="all" />;
}
function ReactRepos() {
  return <ReposList language="react" />;
}
const routeConfig = {
  All: {
    screen: AllRepos,
    navigationOptions: {
      title: 'All',
    },
  },
  React: {
    screen: ReactRepos,
    navigationOptions: {
      title: 'React',
    },
  },
};
const tabNavigatorConfig = {
  initialRouteName: 'All',
  lazy: true,
  scrollEnabled: true,
  indicatorStyle: {
    backgroundColor: '#e7e7e7',
  },
};

export default createMaterialTopTabNavigator(routeConfig, tabNavigatorConfig);
