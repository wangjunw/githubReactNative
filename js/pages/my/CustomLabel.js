import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import CheckBox from 'react-native-check-box';
const deviceWidth = Dimensions.get('window').width;
let languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
export default class CustomLabel extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '自定义标签',
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            if (navigation.getParam('isChange')) {
              Alert.alert(
                '提示',
                '标签已修改，是否保存？',
                [
                  {
                    text: '取消',
                    onPress: () => {
                      navigation.pop();
                    },
                  },
                  {
                    text: '保存',
                    onPress: () => {
                      languageDao.save(navigation.getParam('data'));
                      navigation.pop();
                    },
                  },
                ],
                {cancelable: false},
              );
            } else {
              navigation.pop();
            }
          }}>
          <Image
            source={require('../../../static/images/ic_arrow_back_white_36pt.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <Button
          onPress={() => {
            if (navigation.getParam('isChange')) {
              languageDao.save(navigation.getParam('data'));
            }
            navigation.pop();
          }}
          title="保存"
        />
      ),
    };
  };
  constructor(props) {
    super(props);
    this.changeValues = []; //记录修改了勾选状态的标签
    this.state = {
      labelData: [],
    };
  }
  UNSAFE_componentWillMount() {
    this.loadData();
  }
  loadData = () => {
    languageDao
      .fetch()
      .then(res => {
        this.setState({
          labelData: res,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  changeCheckBox = index => {
    let labelData = [...this.state.labelData];
    labelData[index].checked = !labelData[index].checked;
    var changeIndex = this.changeValues.indexOf(labelData[index].name);
    if (changeIndex > -1) {
      this.changeValues.splice(changeIndex, 1);
    } else {
      this.changeValues.push(labelData[index].name);
    }
    this.props.navigation.setParams({
      isChange: !(this.changeValues.length === 0),
      data: labelData,
    });
    this.setState({
      labelData,
    });
  };
  renderLabelLine = () => {
    if (!this.state.labelData || this.state.labelData.length === 0) {
      return;
    }
    const dataLength = this.state.labelData.length;
    return (
      <View style={styles.scrollView}>
        {this.state.labelData.map((item, index) => (
          <View
            style={[
              styles.labelItem,
              {width: index === dataLength - 1 ? deviceWidth : deviceWidth / 2},
            ]}>
            <CheckBox
              style={styles.checkBox}
              onClick={() => {
                this.changeCheckBox(index);
              }}
              isChecked={item.checked}
              leftText={item.name}
              checkedImage={
                <Image
                  style={styles.checkBoxIcon}
                  source={require('../../../static/images/ic_check_box.png')}
                />
              }
              unCheckedImage={
                <Image
                  style={styles.checkBoxIcon}
                  source={require('../../../static/images/ic_check_box_outline_blank.png')}
                />
              }
            />
          </View>
        ))}
      </View>
    );
  };

  render() {
    return (
      <View>
        <ScrollView>{this.renderLabelLine()}</ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  labelItem: {
    borderBottomWidth: 0.3,
    borderBottomColor: 'darkgray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkBox: {
    flex: 1,
    padding: 10,
  },
  checkBoxIcon: {
    tintColor: '#6495ed',
    width: 24,
    height: 24,
  },
  backIcon: {
    width: 26,
    height: 26,
  },
});
