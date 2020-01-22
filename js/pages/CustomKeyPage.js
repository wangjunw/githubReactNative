import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import CheckBox from 'react-native-check-box';
import {isIPoneX} from '../utils/DeviceUtil';
import NavigationBar from '../components/NavigationBar';
import actions from '../action/index';
import BackPressComponent from '../components/BackPressComponent';
import {THEME_COLOR} from '../config/config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtil from '../utils/NavigationUtil';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ViewUtil from '../utils/ViewUtil';
import ArrayUtil from '../utils/ArrayUtil';

class CustomKeyPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({
      backPress: e => this.onBackPress(e),
    });
    this.changeValues = [];
    this.isRemoveKey = !!this.params.isRemoveKey; //是否显示标签移除
    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
      keys: [],
    };
  }
  onBackPress() {
    this.onBack();
    return true;
  }
  onBack() {
    if (this.changeValues.length > 0) {
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
    if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
      return {
        keys: CustomKeyPage._keys(nextProps, null, prevState),
      };
    }
    return null;
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    //如果props中标签为空则从本地存储中获取标签
    if (CustomKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
    this.setState({
      keys: CustomKeyPage._keys(this.props),
    });
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  static _keys(props, original, state) {
    const {flag, isRemoveKey} = props.navigation.state.params;
    let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    if (isRemoveKey && !original) {
      // 标签移除
      if (state && state.keys && state.keys.length !== 0) {
        return state.keys;
      } else {
        return props.languages[key].map(val => {
          return {
            //注意：不直接修改props，copy一份
            ...val,
            checked: false,
          };
        });
      }
    } else {
      // 自定义标签
      return props.languages[key];
    }
  }

  onSave() {
    if (this.changeValues.length === 0) {
      NavigationUtil.backToPrevPage(this.props.navigation);
      return;
    }
    // 移除标签
    let keys;
    if (this.isRemoveKey) {
      for (let i = 0, len = this.changeValues.length; i < len; i++) {
        ArrayUtil.remove(
          (keys = CustomKeyPage._keys(this.props, true)),
          this.changeValues[i],
          'name',
        );
      }
    }
    this.languageDao.save(keys || this.state.keys);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(this.params.flag);
    NavigationUtil.backToPrevPage(this.props.navigation);
  }
  onClick(data, index) {
    data.checked = !data.checked;
    ArrayUtil.updateArray(this.changeValues, data);
    this.state.keys[index] = data;
    this.setState({
      keys: this.state.keys,
    });
  }
  renderCheckBox(data, index) {
    return (
      <CheckBox
        style={{flex: 1, padding: 10}}
        onClick={() => this.onClick(data, index)}
        isChecked={data.checked}
        leftText={data.name}
        checkedImage={this._checkedImage(true)}
        unCheckedImage={this._checkedImage(false)}
      />
    );
  }
  _checkedImage(checked) {
    // const {theme} = this.params;
    return (
      <Ionicons
        name={checked ? 'ios-checkbox' : 'md-square-outline'}
        size={20}
        style={{
          color: THEME_COLOR,
        }}
      />
    );
  }
  renderView() {
    let dataArray = this.state.keys;
    if (!dataArray || dataArray.length === 0) {
      return;
    }
    let len = dataArray.length;
    let views = [];
    for (let i = 0, l = len; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i], i)}
            {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}
          </View>
          <View style={styles.line} />
        </View>,
      );
    }
    return views;
  }
  render() {
    let title = this.isRemoveKey ? '标签移除' : '自定义标签';
    title =
      this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
    let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
    let navigationBar = (
      <NavigationBar
        title={title}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        style={{backgroundColor: THEME_COLOR}}
        rightButton={ViewUtil.getRightButton(rightButtonTitle, () =>
          this.onSave(),
        )}
      />
    );
    return (
      <View style={styles.container}>
        {navigationBar}
        <ScrollView>{this.renderView()}</ScrollView>
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
)(CustomKeyPage);
const styles = StyleSheet.create({
  container: {flex: 1, marginTop: isIPoneX() ? 30 : 0},
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
});
