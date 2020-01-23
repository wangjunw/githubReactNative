/**
 * popular和trending模块都会用到，用flag标识
 */

import AsyncStorage from '@react-native-community/async-storage';
import ThemeFactory, {ThemeFlags} from '../../../static/styles/ThemeFactory';
const THEME_KEY = 'theme_key';

export default class ThemeDao {
  // 获取当前主体
  getTheme() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        //如果首次缓存中没有数据，就保存默认的主题
        if (!result) {
          this.save(ThemeFlags.Default);
          result = ThemeFlags.Default;
          resolve(data);
        }
        resolve(ThemeFactory.createTheme(result));
      });
    });
  }
  // 保存语言或标签
  save(themeFlag) {
    AsyncStorage.setItem(THEME_KEY, themeFlag, err => {
      console.log('数据保存失败', err);
    });
  }
}
