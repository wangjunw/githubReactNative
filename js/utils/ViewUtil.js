import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default class ViewUtil {
  // 返回按钮
  static getLeftBackButton(callBack) {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12}}
        onPress={callBack}>
        <Ionicons name={'ios-arrow-back'} size={26} style={{color: 'white'}} />
      </TouchableOpacity>
    );
  }
  // 右侧文字按钮
  static getRightButton(title, callBack) {
    return (
      <TouchableOpacity style={{alignItems: 'center'}} onPress={callBack}>
        <Text style={{fontSize: 20, color: '#FFFFFF', marginRight: 10}}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
  // 分享按钮
  static getShareButton(callBack) {
    return (
      <TouchableOpacity onPress={() => {}}>
        <Ionicons
          name="md-share"
          size={20}
          style={{opacity: 0.9, marginRight: 10, color: 'white'}}
        />
      </TouchableOpacity>
    );
  }

  /**
   * 列表项item元素
   * @param {function} callBack 点击回调
   * @param {string} text 显示文本
   * @param {*} color
   * @param {*} Icons 组件
   * @param {*} icon 左侧图标
   * @param {*} expandableIcon 右侧展开箭头图标
   */
  static getSettingItem(callBack, text, color, Icons, icon, expandableIcon) {
    return (
      <TouchableOpacity
        onPress={callBack}
        style={styles.setting_item_container}>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          {Icons && icon ? (
            <Icons name={icon} size={16} style={{color, marginRight: 10}} />
          ) : (
            <View
              style={{
                opacity: 1,
                width: 16,
                height: 16,
                marginRight: 10,
              }}></View>
          )}
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIcon ? expandableIcon : 'ios-arrow-forward'}
          size={24}
          style={{
            marginRight: 10,
            alignSelf: 'center',
            color: color || 'black',
          }}
        />
      </TouchableOpacity>
    );
  }
  /**
   * 我的页面的item
   */
  static getMenuItem(callBack, menu, color, expandableIcon) {
    return ViewUtil.getSettingItem(
      callBack,
      menu.name,
      color,
      menu.Icons,
      menu.icon,
      expandableIcon,
    );
  }
}

const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: 'white',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
