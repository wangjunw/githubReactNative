import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {isIPoneX} from '../utils/DeviceUtil';
import FavoriteUtil from '../utils/FavoriteUtil';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../components/NavigationBar';
import RepoItem from '../components/Repo';
import actions from '../action/index';
import FavoriteDao from '../expand/dao/FavoriteDao';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
import {THEME_COLOR} from '../config/config';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import NavigationUtil from '../utils/NavigationUtil';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const pageSize = 10;
// tab对应的组件
class PopularTabView extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.languageName = tabLabel;
    this.canLoadMore = false; //控制避免多次触发上拉加载
  }
  componentDidMount() {
    this.loadData();
  }
  loadData = loadMore => {
    const url = this.getFetchUrl(this.languageName);
    const store = this._store();
    const {onLoadPopularData, onLoadMorePopular} = this.props;
    // 如果是上拉加载更多
    if (loadMore) {
      onLoadMorePopular(
        this.languageName,
        ++store.pageNo,
        pageSize,
        store.items,
        favoriteDao,
        msg => {
          this.refs['toast'].show(msg);
        },
      );
    } else {
      // 首次加载
      onLoadPopularData(this.languageName, url, pageSize, favoriteDao);
    }
  };
  _store = () => {
    const {popular} = this.props;
    let store = popular[this.languageName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],
        hideLoadingMore: true, // 默认隐藏加载更多
      };
    }
    return store;
  };
  getFetchUrl = languageName => {
    return URL + languageName + QUERY_STR;
  };

  renderItem = data => {
    const repoData = data.item;
    return (
      <RepoItem
        projectModel={repoData}
        onFavorite={(repoData, isFavorite) =>
          FavoriteUtil.onFavorite(
            favoriteDao,
            repoData.item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          )
        }
        onSelect={callback => {
          NavigationUtil.goPage(
            {
              projectModel: repoData.item,
              flag: FLAG_STORAGE.flag_popular,
              callback,
            },
            'Detail',
          );
        }}
      />
    );
  };
  // list底部加载更多组件
  getListFooter() {
    return this._store().hideLoadingMore ? null : (
      <View style={styles.listFooter}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }
  render() {
    let store = this._store();
    return (
      <View>
        <FlatList
          style={styles.tabContainer}
          data={store.projectModels}
          renderItem={item => this.renderItem(item)}
          keyExtractor={item => '' + item.item.id}
          refreshControl={
            <RefreshControl
              title={'Loading...'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => {
                this.loadData();
              }}
              tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={() => this.getListFooter()}
          onEndReached={() => {
            // 加延时避免极端情况下onMomentumScrollBegin回调晚执行的问题
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onMomentumScrollBegin={() => {
            // 列表开始滚动时触发
            this.canLoadMore = true;
          }}
          onEndReachedThreshold={0.5}
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  popular: state.popular,
});
const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (languageName, url, pageSize, favoriteDao) => {
    return dispatch(
      actions.onLoadPopularData(languageName, url, pageSize, favoriteDao),
    );
  },
  onLoadMorePopular: (
    languageName,
    pageNo,
    pageSize,
    items,
    favoriteDao,
    callback,
  ) => {
    return dispatch(
      actions.onLoadMorePopular(
        languageName,
        pageNo,
        pageSize,
        items,
        favoriteDao,
        callback,
      ),
    );
  },
});
// connect并非只能在默认导出的组件上使用，可以在任意组件上使用
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
    let statusBarStyle = {
      backgroundColor: THEME_COLOR,
    };
    let navigationBar = (
      <NavigationBar
        title={'最热'}
        statusBar={statusBarStyle}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
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
    return (
      <View style={{flex: 1, marginTop: isIPoneX() ? 30 : 0}}>
        {navigationBar}
        <TopNavigator />
      </View>
    );
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
  listFooter: {
    alignItems: 'center',
  },
  indicator: {color: 'red', margin: 10},
});
