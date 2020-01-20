/**
 * popular和trending模块都会用到，用flag标识
 */

import AsyncStorage from '@react-native-community/async-storage';
import keys from '../../../static/data/keys.json';
import langs from '../../../static/data/langs.json';
export let FLAG_LANGUAGE = {
  flag_language: 'flag_language_language',
  flag_key: 'flag_language_key',
};
export default class LanguageDao {
  constructor(flag) {
    this.flag = flag;
  }
  // 获取语言或标签
  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (err, result) => {
        if (err) {
          reject(err);
          return;
        } else {
          // 如果从存储中获取到数据,直接返回
          if (result) {
            try {
              resolve(JSON.parse(result));
            } catch (e) {
              reject(e);
            }
          } else {
            //如果首次缓存中没有数据，就从本地文件中获取
            let data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys;
            this.save(data);
            resolve(data);
          }
        }
      });
    });
  }
  // 保存语言或标签
  save(data) {
    AsyncStorage.setItem(this.flag_key, JSON.stringify(data), err => {
      console.log('数据保存失败', err);
    });
  }
}
