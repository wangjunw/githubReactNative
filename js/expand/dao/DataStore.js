import {AsyncStorage} from 'react-native';
export default class DataStore {
  /**
   * 检查timestamp是否在有效期内
   * @param {string} timestamp 时间戳
   * @return {boolean} true，在有效期不需要更新；false相反
   */
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    // 同一天内四个小时以内为有效期
    if (currentDate.getMonth() !== targetDate.getMonth()) {
      return false;
    }
    if (currentDate.getDate() !== targetDate.getDate()) {
      return false;
    }
    if (currentDate.getHours() - targetDate.getHours() > 4) {
      return false;
    }
    return true;
  }

  // 保存数据
  saveData(key, data, callback) {
    AsyncStorage.setItem(key, JSON.stringify(this._wrapData(data)), callback);
  }
  // 对数据做一层包装，添加有效期
  _wrapData(data) {
    return {data, timestamp: new Date().getTime()};
  }
  // 获取本地数据
  fetchLocalData(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key, (err, result) => {
        if (!err) {
          try {
            resolve(JSON.parse(result));
          } catch (error) {
            reject(error);
          }
        } else {
          reject(err);
        }
      });
    });
  }
  // 获取网络数据
  fetchNetData(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => {
          if (res.ok) {
            res.json();
          }
          throw new Error('network is faild！');
        })
        .then(data => {
          this.saveData(url, data);
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
