import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {isIPoneX} from '../utils/DeviceUtil';
import FavoriteUtil from '../utils/FavoriteUtil';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../components/NavigationBar';
import RepoItem from '../components/Repo';
import actions from '../action/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FavoriteDao from '../expand/dao/FavoriteDao';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import NavigationUtil from '../utils/NavigationUtil';
import EventBus from 'react-native-event-bus';
import eventTyps from '../utils/EventTypes';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

// 友盟
import AnalysisUtil from '../utils/AnalyticsUtil';

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const pageSize = 10;
// tab对应的组件
class PopularTabView extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.languageName = tabLabel;
    this.canLoadMore = false; //控制避免多次触发上拉加载
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(
      eventTyps.favorite_change_popular,
      (this.favoriteChangeListener = () => {
        this.isFavoriteChanged = true;
      }),
    );
    EventBus.getInstance().addListener(
      eventTyps.bottom_tab_select,
      (this.bottomTabSelectListener = (data) => {
        // 如果切换到最热页面并且收藏状态改变了，刷新
        if (data.to === 0 && this.isFavoriteChanged) {
          this.loadData(null, true);
        }
      }),
    );
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }
  loadData = (loadMore, isRefreshFavorite) => {
    const url = this.getFetchUrl(this.languageName);
    const store = this._store();
    const {onLoadPopularData, onLoadMorePopular, onFlushFavorite} = this.props;
    // 如果是上拉加载更多
    if (loadMore) {
      onLoadMorePopular(
        this.languageName,
        ++store.pageNo,
        pageSize,
        store.items,
        favoriteDao,
        (msg) => {
          this.refs['toast'].show(msg);
        },
      );
    } else if (isRefreshFavorite) {
      onFlushFavorite(
        this.languageName,
        store.pageNo,
        pageSize,
        store.items,
        favoriteDao,
      );
      this.isFavoriteChanged = false;
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
  getFetchUrl = (languageName) => {
    return URL + languageName + QUERY_STR;
  };

  renderItem = (data) => {
    const repoData = data.item;
    const {theme} = this.props;
    return (
      <RepoItem
        projectModel={repoData}
        theme={theme}
        onFavorite={(repoData, isFavorite) =>
          FavoriteUtil.onFavorite(
            favoriteDao,
            repoData.item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          )
        }
        onSelect={(callback) => {
          NavigationUtil.goPage(
            {
              theme,
              projectModel: repoData,
              flag: FLAG_STORAGE.flag_popular,
              callback, //页面之间同步收藏状态
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
    const {theme} = this.props;
    return (
      <View>
        <FlatList
          style={styles.tabContainer}
          data={store.projectModels}
          renderItem={(item) => this.renderItem(item)}
          keyExtractor={(item) => '' + item.item.id}
          refreshControl={
            <RefreshControl
              title={'Loading...'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => {
                this.loadData();
              }}
              tintColor={theme.themeColor}
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
const mapStateToProps = (state) => ({
  popular: state.popular,
});
const mapDispatchToProps = (dispatch) => ({
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
  onFlushFavorite: (languageName, pageNo, pageSize, items, favoriteDao) => {
    dispatch(
      actions.onFlushPopularFavorite(
        languageName,
        pageNo,
        pageSize,
        items,
        favoriteDao,
      ),
    );
  },
});
// connect并非只能在默认导出的组件上使用，可以在任意组件上使用
const PopularTabViewWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopularTabView);

class PopularPage extends Component {
  constructor(props) {
    super(props);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }
  _getTabs() {
    const tabs = {};
    const {keys, theme} = this.props;
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: (props) => (
            <PopularTabViewWithRedux
              {...props}
              tabLabel={item.name}
              theme={theme}
            />
          ), //返回组件可以传递函数
          navigationOptions: {
            title: item.name,
          },
        };
      }
    });
    return tabs;
  }
  renderRightButton() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          AnalysisUtil.onEvent('searchButtonClick');
          NavigationUtil.goPage({theme}, 'Search');
        }}>
        <View style={{padding: 5, marginRight: 8}}>
          <Ionicons
            name={'ios-search'}
            size={24}
            style={{
              marginRight: 8,
              alignSelf: 'center',
              color: 'white',
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    const {keys, theme} = this.props;
    let statusBarStyle = {
      backgroundColor: theme.themeColor,
    };
    let navigationBar = (
      <NavigationBar
        title={'最热'}
        statusBar={statusBarStyle}
        style={theme.styles.navBar}
        rightButton={this.renderRightButton()}
      />
    );
    const TopNavigator =
      keys.length > 0
        ? createAppContainer(
            createMaterialTopTabNavigator(this._getTabs(), {
              lazy: true,
              scrollEnabled: true,
              tabBarOptions: {
                tabStyle: styles.tabStyle,
                upperCaseLabel: false, //标签不大写
                scrollEnabled: true, //选项卡左右可滑动
                style: {
                  backgroundColor: theme.themeColor,
                },
                indicatorStyle: styles.indicatorStyle, // 指示器样式(tab下的横线)
                labelStyle: styles.labelStyle, // 文字的样式
              },
              lazy: true, //懒加载，避免每次都渲染每个tab下的view
            }),
          )
        : null;
    return (
      <View style={{flex: 1}}>
        {navigationBar}
        {TopNavigator && <TopNavigator />}
      </View>
    );
  }
}
const mapLangsStateToProps = (state) => ({
  keys: state.language.keys,
  theme: state.theme.theme,
});
const mapLangsDispatchToProps = (dispatch) => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(
  mapLangsStateToProps,
  mapLangsDispatchToProps,
)(PopularPage);
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
