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
import actions from '../action/index';
const URL = 'https://github.com/trending/';
import {THEME_COLOR} from '../config/config';
import NavigationUtil from '../utils/NavigationUtil';
const pageSize = 10;
const EVENT_TIME_SPAN_CHANGE = 'EVENT_TIME_SPAN_CHANGE';
// tab对应的组件
class TrendingTabView extends Component {
  constructor(props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.languageName = tabLabel;
    this.canLoadMore = false; //控制避免多次触发上拉加载
    this.timeSpan = timeSpan;
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
    this.loadData();
  }
  componentWillUnmount() {
    // 页面卸载，事件移除
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }
  }
  loadData = loadMore => {
    const url = this.getFetchUrl(this.languageName);
    console.log(2222, url);
    const store = this._store();
    const {onLoadTrendingData, onLoadMoreTrending} = this.props;
    // 如果是上拉加载更多
    if (loadMore) {
      onLoadMoreTrending(
        this.languageName,
        ++store.pageNo,
        pageSize,
        store.items,
        msg => {
          this.refs['toast'].show(msg);
        },
      );
    } else {
      // 首次加载
      onLoadTrendingData(this.languageName, url, pageSize);
    }
  };
  _store = () => {
    const {trending} = this.props;
    let store = trending[this.languageName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModes: [],
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
        repoData={repoData}
        onSelect={() => {
          NavigationUtil.goPage({projectModel: repoData}, 'Detail');
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
  onLoadTrendingData: (languageName, url, pageSize) => {
    return dispatch(actions.onLoadTrendingData(languageName, url, pageSize));
  },
  onLoadMoreTrending: (languageName, pageNo, pageSize, items, callback) => {
    return dispatch(
      actions.onLoadMoreTrending(
        languageName,
        pageNo,
        pageSize,
        items,
        callback,
      ),
    );
  },
});
// connect并非只能在默认导出的组件上使用，可以在任意组件上使用
const TrendingTabViewWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendingTabView);

export default class TrendingPage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['All', 'C', 'C#', 'PHP'];
    this.state = {
      timeSpan: TimeSpans[0],
    };
  }
  _getTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => (
          <TrendingTabViewWithRedux
            {...props}
            timeSpan={this.state.timeSpan}
            tabLabel={item}
          />
        ), //返回组件可以传递函数
        navigationOptions: {
          title: item,
        },
      };
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
    if (!this.TopNavigator) {
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
        }),
      );
    }
    return this.TopNavigator;
  }
  render() {
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
    const TopNavigator = this._TopNavigator();
    return (
      <View style={{flex: 1, marginTop: isIPoneX() ? 30 : 0}}>
        {navigationBar}
        <TopNavigator />
        {this.renderTrendingDialog()}
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
