import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {createAppContainer} from 'react-navigation';
import FavoriteUtil from '../utils/FavoriteUtil';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../components/NavigationBar';
import RepoItem from '../components/Repo';
import TrendingRepoItem from '../components/TrendingRepo';
import actions from '../action/index';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import NavigationUtil from '../utils/NavigationUtil';
import EventBus from 'react-native-event-bus';
import eventTypes from '../utils/EventTypes';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
// tab对应的组件
class FavoriteTabView extends Component {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }
  componentDidMount() {
    this.loadData(true);
    // 监听eventBus，底部tab切换
    EventBus.getInstance().addListener(
      eventTypes.bottom_tab_select,
      (this.listener = (data) => {
        // 当切换到收藏页时刷新数据，不展示loading
        if (data.to === 2) {
          this.loadData(false);
        }
      }),
    );
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }
  loadData = (isLoading) => {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isLoading);
  };
  _store = () => {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],
      };
    }
    return store;
  };
  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, this.storeName);
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(eventTypes.favorite_change_popular);
    } else {
      EventBus.getInstance().fireEvent(eventTypes.favorite_change_trending);
    }
  }
  renderItem = (data) => {
    const {theme} = this.props;
    const repoData = data.item;
    const Item =
      this.storeName === FLAG_STORAGE.flag_popular
        ? RepoItem
        : TrendingRepoItem;
    return (
      <Item
        projectModel={repoData}
        theme={theme}
        onFavorite={(repoData, isFavorite) =>
          this.onFavorite(repoData.item, isFavorite)
        }
        onSelect={(callback) => {
          NavigationUtil.goPage(
            {
              theme,
              projectModel: repoData,
              flag: this.storeName,
              callback, //页面之间同步收藏状态
            },
            'Detail',
          );
        }}
      />
    );
  };
  render() {
    let store = this._store();
    const {theme} = this.props;
    return (
      <View>
        <FlatList
          style={styles.tabContainer}
          data={store.projectModels}
          renderItem={(item) => this.renderItem(item)}
          keyExtractor={(item) => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading...'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => {
                this.loadData(true);
              }}
              tintColor={theme.themeColor}
            />
          }
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    favorite: state.favorite,
  };
};
const mapDispatchToProps = (dispatch) => ({
  onLoadFavoriteData: (storeName, isLoading) => {
    return dispatch(actions.onLoadFavoriteData(storeName, isLoading));
  },
});
// connect并非只能在默认导出的组件上使用，可以在任意组件上使用
const FavoriteTabViewWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoriteTabView);

class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['最热', '趋势'];
  }
  render() {
    const {theme} = this.props;
    let statusBarStyle = {
      backgroundColor: theme.themeColor,
    };
    let navigationBar = (
      <NavigationBar
        title={'收藏'}
        statusBar={statusBarStyle}
        style={theme.styles.navBar}
      />
    );
    const TopNavigator = createAppContainer(
      createMaterialTopTabNavigator(
        {
          Popular: {
            screen: (props) => (
              <FavoriteTabViewWithRedux
                {...props}
                theme={theme}
                flag={FLAG_STORAGE.flag_popular}
              />
            ),
            navigationOptions: {
              title: '最热',
            },
          },
          Trending: {
            screen: (props) => (
              <FavoriteTabViewWithRedux
                {...props}
                theme={theme}
                flag={FLAG_STORAGE.flag_trending}
              />
            ),
            navigationOptions: {
              title: '趋势',
            },
          },
        },
        {
          lazy: true,
          scrollEnabled: true,
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false, //标签不大写
            style: {
              backgroundColor: theme.themeColor,
            },
            indicatorStyle: styles.indicatorStyle, // 指示器样式(tab下的横线)
            labelStyle: styles.labelStyle, // 文字的样式
          },
        },
      ),
    );
    return (
      <View style={{flex: 1}}>
        {navigationBar}
        <TopNavigator />
      </View>
    );
  }
}
const mapFavoriteStateToProps = (state) => ({
  theme: state.theme.theme,
});
export default connect(mapFavoriteStateToProps)(FavoritePage);

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
