/**
 * 趋势页
 */
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
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {isIPoneX} from '../utils/DeviceUtil';
import Toast from 'react-native-easy-toast';
import TrendingDialog, {TimeSpans} from '../components/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from '../components/NavigationBar';
import TrendingRepo from '../components/TrendingRepo';
import FavoriteUtil from '../utils/FavoriteUtil';
import actions from '../action/index';
const URL = 'https://github.com/trending/';
import {THEME_COLOR} from '../config/config';
import NavigationUtil from '../utils/NavigationUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import EventBus from 'react-native-event-bus';
import eventTyps from '../utils/EventTypes';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ArrayUtil from '../utils/ArrayUtil';
const pageSize = 10;
const EVENT_TIME_SPAN_CHANGE = 'EVENT_TIME_SPAN_CHANGE';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
// tab对应的组件
class TrendingTabView extends Component {
  constructor(props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.languageName = tabLabel;
    this.canLoadMore = false; //控制避免多次触发上拉加载
    this.timeSpan = timeSpan;
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    // 组件挂载完成，监听事件
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(
      EVENT_TIME_SPAN_CHANGE,
      timeSpan => {
        this.timeSpan = timeSpan;
        this.loadData();
      },
    );
    EventBus.getInstance().addListener(
      eventTyps.favorite_change_trending,
      (this.favoriteChangeListener = () => {
        this.isFavoriteChanged = true;
      }),
    );
    EventBus.getInstance().addListener(
      eventTyps.bottom_tab_select,
      (this.bottomTabSelectListener = data => {
        // 如果切换到最热页面并且收藏状态改变了，刷新
        if (data.to === 1 && this.isFavoriteChanged) {
          this.loadData(null, true);
        }
      }),
    );
  }
  componentWillUnmount() {
    // 页面卸载，事件移除
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }
  loadData = (loadMore, isRefreshFavorite) => {
    const url = this.getFetchUrl(this.languageName);
    const store = this._store();
    const {
      onLoadTrendingData,
      onLoadMoreTrending,
      onFlushFavorite,
    } = this.props;
    // 如果是上拉加载更多
    if (loadMore) {
      onLoadMoreTrending(
        this.languageName,
        ++store.pageNo,
        pageSize,
        store.items,
        favoriteDao,
        msg => {
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
      onLoadTrendingData(this.languageName, url, pageSize, favoriteDao);
    }
  };
  _store = () => {
    const {trending} = this.props;
    let store = trending[this.languageName];
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
    return URL + languageName + '?' + this.timeSpan.searchText;
  };

  renderItem = data => {
    const repoData = data.item;
    return (
      <TrendingRepo
        projectModel={repoData}
        onFavorite={(repoData, isFavorite) =>
          FavoriteUtil.onFavorite(
            favoriteDao,
            repoData.item,
            isFavorite,
            FLAG_STORAGE.flag_trending,
          )
        }
        onSelect={callback => {
          NavigationUtil.goPage(
            {
              projectModel: repoData,
              flag: FLAG_STORAGE.flag_trending,
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
          data={store.projectModes}
          renderItem={item => this.renderItem(item)}
          keyExtractor={item => '' + (item.id || item.fullName)}
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
  trending: state.trending,
});
const mapDispatchToProps = dispatch => ({
  onLoadTrendingData: (languageName, url, pageSize, favoriteDao) => {
    return dispatch(
      actions.onLoadTrendingData(languageName, url, pageSize, favoriteDao),
    );
  },
  onLoadMoreTrending: (
    languageName,
    pageNo,
    pageSize,
    items,
    favoriteDao,
    callback,
  ) => {
    return dispatch(
      actions.onLoadMoreTrending(
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
      actions.onFlushTrendingFavorite(
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
const TrendingTabViewWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendingTabView);

class TrendingPage extends Component {
  constructor(props) {
    super(props);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.preKeys = [];
    this.state = {
      timeSpan: TimeSpans[0],
    };
  }
  _getTabs() {
    const tabs = {};
    const {keys} = this.props;
    this.preKeys = keys;
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => (
            <TrendingTabViewWithRedux
              {...props}
              timeSpan={this.state.timeSpan}
              tabLabel={item.name}
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
  // title位置
  renderTitleView() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.dialog.show();
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: '#fff', fontWeight: '400'}}>
              趋势 {this.state.timeSpan.showText}
            </Text>
            <MaterialIcons
              name={'arrow-drop-down'}
              size={22}
              style={{color: 'white'}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  onSelectTimeSpan = timeSpan => {
    this.dialog.close();
    this.setState({
      timeSpan,
    });
    // 当时间改变，触发事件让列表更新
    DeviceEventEmitter.emit(EVENT_TIME_SPAN_CHANGE, timeSpan);
  };
  renderTrendingDialog() {
    return (
      <TrendingDialog
        ref={dialog => (this.dialog = dialog)}
        onSelect={this.onSelectTimeSpan}
      />
    );
  }
  _TopNavigator() {
    // 判断，避免每次选择时间重新创建tab，但是需要使用DeviceEventEmitter配合，否则列表也不刷新
    if (
      !this.TopNavigator ||
      !ArrayUtil.isEqual(this.preKeys, this.props.keys)
    ) {
      this.TopNavigator = createAppContainer(
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
          lazy: true,
        }),
      );
    }
    return this.TopNavigator;
  }
  render() {
    const {keys} = this.props;
    let statusBarStyle = {
      backgroundColor: THEME_COLOR,
    };
    let navigationBar = (
      <NavigationBar
        titleView={this.renderTitleView()}
        statusBar={statusBarStyle}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
    const TopNavigator = keys.length > 0 ? this._TopNavigator() : null;
    return (
      <View style={{flex: 1, marginTop: isIPoneX() ? 30 : 0}}>
        {navigationBar}
        {TopNavigator && <TopNavigator />}
        {this.renderTrendingDialog()}
      </View>
    );
  }
}
const mapLangsStateToProps = state => ({
  keys: state.language.languages,
});
const mapLangsDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(
  mapLangsStateToProps,
  mapLangsDispatchToProps,
)(TrendingPage);
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
