import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import RepoItem from '../components/Repo';
import actions from '../action/index';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = 'red';
// tab对应的组件
class PopularTabView extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.languageName = tabLabel;
  }
  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    const url = this.getFetchUrl(this.languageName);
    const {onLoadPopularData} = this.props;
    onLoadPopularData(this.languageName, url);
  };
  getFetchUrl = languageName => {
    return URL + languageName + QUERY_STR;
  };

  renderItem = data => {
    const repoData = data.item;
    return <RepoItem repoData={repoData} />;
  };
  render() {
    const {popular} = this.props;
    let languageData = popular[this.languageName];
    if (!languageData) {
      languageData = {
        items: [],
        isLoading: false,
      };
    }
    return (
      <View>
        <FlatList
          style={styles.tabContainer}
          data={languageData.items}
          renderItem={item => this.renderItem(item)}
          keyExtractor={item => '' + item.id}
          refreshControl={
            <RefreshControl
              title={'Loading...'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={languageData.isLoading}
              onRefresh={() => {
                this.loadData();
              }}
              tintColor={THEME_COLOR}
            />
          }
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  popular: state.popular,
});
const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (languageName, url) => {
    return dispatch(actions.onLoadPopularData(languageName, url));
  },
});
const PopularTabViewWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopularTabView);

export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'iOS', 'React', 'React Native'];
  }
  _getTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabViewWithRedux {...props} tabLabel={item} />, //返回组件可以传递函数
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }
  render() {
    const TopNavigator = createAppContainer(
      createMaterialTopTabNavigator(this._getTabs(), {
        lazy: true,
        scrollEnabled: true,
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false, //标签不大写
          scrollEnabled: true, //选项卡左右可滑动
          style: {
            backgroundColor: '#678',
          },
          indicatorStyle: styles.indicatorStyle, // 指示器样式(tab下的横线)
          labelStyle: styles.labelStyle, // 文字的样式
        },
      }),
    );
    return <TopNavigator />;
  }
}

const styles = StyleSheet.create({
  tabContainer: {
    color: 'red',
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    backgroundColor: '#fff',
    height: 2,
  },
  labelStyle: {
    fontSize: 13,
    marginBottom: 6,
    marginTop: 6,
  },
});
