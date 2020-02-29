import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {isIPoneX} from '../utils/DeviceUtil';
import FavoriteUtil from '../utils/FavoriteUtil';
import Toast from 'react-native-easy-toast';
import RepoItem from '../components/Repo';
import actions from '../action/index';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import NavigationUtil from '../utils/NavigationUtil';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import BackPressComponent from '../components/BackPressComponent';
import GlobalStyles from '../../static/styles/GlobalStyles';
import ViewUtil from '../utils/ViewUtil';
import {TextInput} from 'react-native-paper';
import {ios, android} from '../config/config';
import Utils from '../utils/FavoriteUtil';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const pageSize = 10;

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({
      backPress: e => this.onBackPress(e),
    });
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.isKeyChange = false; //判断返回最热页面时是否点击了添加操作
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  // 加载数据
  loadData(loadMore) {
    const {onSearch, onSearchLoadMore, search, keys} = this.props;
    if (loadMore) {
      onSearchLoadMore(
        ++search.pageNo,
        pageSize,
        search.items,
        this.favoriteDao,
        callback => {
          this.toast.show('没有更多了');
        },
      );
    } else {
      onSearch(
        this.inputKey,
        (this.searchToken = new Date().getTime()),
        pageSize,
        favoriteDao,
        keys,
        message => {
          this.toast.show(message);
        },
      );
    }
  }
  // 物理返回键
  onBackPress() {
    const {onSearchCancel, onLoadLanguage} = this.props;
    onSearchCancel(); // 推出就取消搜索
    this.refs.input.blur(); //失去焦点收起键盘
    NavigationUtil.backToPrevPage(this.props.navigation);
    // 如果收藏了当前的搜索，重新加载最热
    if (this.isKeyChange) {
      onLoadLanguage(FLAG_LANGUAGE.flag_key);
    }
    return true;
  }
  saveKey() {
    const {keys} = this.props;
    let key = this.inputKey;
    if (Utils.checkKeyIsExist(keys, key)) {
      this.toast.show(key + '已经存在');
    } else {
      key = {
        path: key,
        name: key,
        checked: true,
      };
      keys.unshift(key);
      this.languageDao.save(keys);
      this.toast.show(key.name + '保存成功');
      this.isKeyChange = true;
    }
  }
  onRightButtonClick() {
    const {onSearchCancel, search} = this.props;
    if (search.showText === '搜索') {
      this.loadData();
    } else {
      onSearchCancel(this.searchToken);
    }
  }
  genIndicator() {
    const {search} = this.props;
    return search.hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }
  trim(str) {
    return str.replace(/(^\s*) | (\s*$)/g, '');
  }
  renderNavBar() {
    const {theme} = this.params;
    const {showText, inputKey} = this.props.search;
    const placeholder = inputKey || '请输入';
    let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress());
    let inputView = (
      <TextInput
        ref="input"
        placeholder={placeholder}
        onChangeText={text => (this.inputKey = this.trim(text))}
        style={styles.textInput}
      />
    );
    let rightButton = (
      <TouchableOpacity
        onPress={() => {
          this.refs.input.blur(); //收起键盘
          this.onRightButtonClick();
        }}>
        <View style={{marginRight: 10}}>
          <Text style={styles.title}>{showText}</Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View
        style={{
          backgroundColor: theme.themeColor,
          flexDirection: 'row',
          alignItems: 'center',
          height:
            Platform.OS === 'ios' ? ios.NAV_BAR_HEIGHT : android.NAV_BAR_HEIGHT,
        }}>
        {backButton}
        {inputView}
        {rightButton}
      </View>
    );
  }
  renderItem(data) {
    const item = data.item;
    const {theme} = this.params;
    return (
      <RepoItem
        projectModel={item}
        theme={theme}
        onSelect={callback => {
          NavigationUtil.goPage(
            {
              theme,
              projectModel: item,
              flag: FLAG_STORAGE.flag_popular,
              callback,
            },
            'Detail',
          );
        }}
        onFavorite={(item, isFavorite) =>
          FavoriteUtil.onFavorite(
            favoriteDao,
            item.item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          )
        }
      />
    );
  }
  render() {
    NavigationUtil.navigation = this.props.navigation;
    const {isLoading, projectModels, showBottomButton} = this.props.search;
    const {theme} = this.params;
    let statusBar = null;
    if (Platform.OS === 'ios') {
      statusBar = (
        <View style={[styles.statusBar, {backgroundColor: theme.themeColor}]} />
      );
    }
    let listView = !isLoading ? (
      <FlatList
        data={projectModels}
        renderItem={data => this.renderItem(data)}
        keyExtractor={item => '' + item.item.id}
        contentInset={{
          bottom: 45,
        }} //底部留出距离，避免按钮遮住列表
        refreshControl={
          <RefreshControl
            title={'Loading'}
            titleColor={theme.themeColor}
            colors={[theme.themeColor]}
            refreshing={isLoading}
            onRefresh={() => this.loadData()}
            tintColor={theme.themeColor}
          />
        }
        ListFooterComponent={() => this.genIndicator()}
        onEndReached={() => {
          setTimeout(() => {
            if (this.canLoadMore) {
              //fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
              this.loadData(true);
              this.canLoadMore = false;
            }
          }, 100);
        }}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
        }}
      />
    ) : null;
    let bottomButton = showBottomButton ? (
      <TouchableOpacity
        style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
        onPress={() => {
          this.saveKey();
        }}>
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.title}>加入标签栏</Text>
        </View>
      </TouchableOpacity>
    ) : null;
    // 加载样式
    let indicatorView = isLoading ? (
      <ActivityIndicator
        style={styles.centering}
        size="large"
        animating={isLoading}
      />
    ) : null;
    let resultView = (
      <View style={{flex: 1}}>
        {indicatorView}
        {listView}
      </View>
    );
    return (
      <View style={{flex: 1, marginTop: isIPoneX() ? 30 : 0}}>
        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButton}
        <Toast ref={toast => (this.toast = toast)} />
      </View>
    );
  }
}
const mapLangsStateToProps = state => ({
  keys: state.language.keys, //首页所有标签
  search: state.search,
});
const mapLangsDispatchToProps = dispatch => ({
  onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callback) =>
    dispatch(
      actions.onSearch(
        inputKey,
        token,
        pageSize,
        favoriteDao,
        popularKeys,
        callback,
      ),
    ),
  onSearchCancel: token => dispatch(actions.onSearchCancel(token)),
  onSearchLoadMore: (pageNo, pageSize, dataArray, favoriteDao, callback) =>
    dispatch(
      actions.onSearchLoadMore(
        pageNo,
        pageSize,
        dataArray,
        favoriteDao,
        callback,
      ),
    ),
  onLoadLanguage: key => dispatch(actions.onLoadLanguage(key)),
});
export default connect(
  mapLangsStateToProps,
  mapLangsDispatchToProps,
)(SearchPage);
const styles = StyleSheet.create({
  indicator: {color: 'red', margin: 10},
  statusBar: {
    height: 20,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  bottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
    height: 40,
    left: 10,
    right: 10,
    position: 'absolute',
    borderRadius: 3,
    top: GlobalStyles.window_height - 45 - (isIPoneX ? 34 : 0),
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textInput: {
    flex: 1,
    height: Platform.OS === 'ios' ? 26 : 36,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: 'white',
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: 'white',
  },
  title: {fontSize: 18, color: 'white', fontWeight: '500'},
});
