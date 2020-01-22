import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, Alert, TouchableHighlight} from 'react-native';
import SortableListView from 'react-native-sortable-listview';
import {isIPoneX} from '../utils/DeviceUtil';
import NavigationBar from '../components/NavigationBar';
import actions from '../action/index';
import BackPressComponent from '../components/BackPressComponent';
import {THEME_COLOR} from '../config/config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationUtil from '../utils/NavigationUtil';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ViewUtil from '../utils/ViewUtil';
import ArrayUtil from '../utils/ArrayUtil';

class SortKeyPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({
      backPress: e => this.onBackPress(e),
    });

    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
      checkedArray: SortKeyPage._keys(this.props),
    };
  }
  onBackPress() {
    this.onBack();
    return true;
  }
  onBack() {
    if (
      !ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)
    ) {
      Alert.alert('提示', '是否保存修改', [
        {
          text: '否',
          onPress: () => {
            NavigationUtil.backToPrevPage(this.props.navigation);
          },
        },
        {
          text: '是',
          onPress: () => {
            this.onSave();
          },
        },
      ]);
    } else {
      NavigationUtil.backToPrevPage(this.props.navigation);
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedArray = SortKeyPage._keys(nextProps, null, prevState);
    if (prevState.keys !== checkedArray) {
      return {
        keys: checkedArray,
      };
    }
    return null;
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    //如果props中标签为空则从本地存储中获取标签
    if (SortKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  static _keys(props, state) {
    if (state && state.checkedArray && state.checkedArray.length !== 0) {
      return state.checkedArray;
    }
    const flag = SortKeyPage._flag(props);
    let dataArray = props.languages[flag] || [];
    let keys = [];
    for (let i = 0, l = dataArray.length; i < l; i++) {
      let data = dataArray[i];
      if (data.checked) {
        keys.push(data);
      }
    }
    return keys;
  }
  static _flag(props) {
    const {flag} = props.navigation.state.params;
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
  }
  onSave(hasChecked) {
    if (!hasChecked) {
      // 没有排序就直接返回
      if (
        ArrayUtil.isEqual(
          SortKeyPage._keys(this.props),
          this.state.checkedArray,
        )
      ) {
        NavigationUtil.backToPrevPage(this.props.navigation);
        return;
      }
    }
    // 将排序后数据保存到本地
    this.languageDao.save(this.getSortResult());
    const {onLoadLanguage} = this.props;
    onLoadLanguage(this.params.flag);
    NavigationUtil.backToPrevPage(this.props.navigation);
  }
  forceUpdate() {}
  /**
   *  获取排序后的标签结果
   */
  getSortResult() {
    const flag = SortKeyPage._flag(this.props);
    // 复制排序后的一份数据
    let sortResultArray = ArrayUtil.clone(this.props.languages[flag]);
    // 原始数据
    const originalCheckedArray = SortKeyPage._keys(this.props);
    for (let i = 0, j = originalCheckedArray.length; i < j; i++) {
      let item = originalCheckedArray[i];
      //找到要替换的元素所在位置
      let index = this.props.languages[flag].indexOf(item);
      //进行替换
      sortResultArray.splice(index, 1, this.state.checkedArray[i]);
    }
    return sortResultArray;
  }
  render() {
    let title =
      this.params.flag === FLAG_LANGUAGE.flag_language
        ? '语言排序'
        : '标签排序';
    let navigationBar = (
      <NavigationBar
        title={title}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        style={{backgroundColor: THEME_COLOR}}
        rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
      />
    );
    return (
      <View style={styles.container}>
        {navigationBar}
        <SortableListView
          data={this.state.checkedArray}
          order={Object.keys(this.state.checkedArray)}
          onRowMoved={e => {
            this.state.checkedArray.splice(
              e.to,
              0,
              this.state.checkedArray.splice(e.from, 1)[0],
            );
            this.forceUpdate();
          }}
          renderRow={row => <RowComponent data={row} {...this.params} />}
        />
      </View>
    );
  }
}
const mapLangsStateToProps = state => ({
  languages: state.language,
});
const mapLangsDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(
  mapLangsStateToProps,
  mapLangsDispatchToProps,
)(SortKeyPage);

class RowComponent extends Component {
  render() {
    return (
      <TouchableHighlight
        style={this.props.data.checked ? styles.item : styles.hidden}
        {...this.props.sortHandlers}>
        <View style={{marginLeft: 10, flexDirection: 'row'}}>
          <MaterialCommunityIcons
            name="sort"
            size={16}
            style={{marginRight: 10, color: THEME_COLOR}}
          />
          <Text>{this.props.data.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center',
  },
  hidden: {
    height: 0,
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
});
