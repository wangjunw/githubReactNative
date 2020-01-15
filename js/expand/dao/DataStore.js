import AsyncStorage from '@react-native-community/async-storage';
import Trending from 'GitHubTrending'; //获取trending模块数据
export const FLAG_STORAGE = {
  flag_popular: 'popular',
  flag_trending: 'trending',
};
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
  /**
   * 获取网络数据
   * @param {string} url
   * @param {string} flag 区分是最热页还是趋势页调用
   */
  fetchNetData(url, flag) {
    return new Promise((resolve, reject) => {
      if (flag !== FLAG_STORAGE.flag_trending) {
        fetch(url)
          .then(res => {
            if (res.ok) {
              return res.json();
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
      } else {
        new Trending()
          .fetchTrending(url)
          .then(items => {
            if (!items) {
              throw new Error('response is null');
            }
            this.saveData(url, items);
            resolve(items);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }
  // 入口方法
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url)
        .then(wrapData => {
          if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
            resolve(wrapData);
          } else {
            this.fetchNetData(url, flag)
              .then(data => {
                resolve(this._wrapData(data));
              })
              .catch(err => {
                reject(err);
              });
          }
        })
        .catch(error => {
          this.fetchNetData(url, flag)
            .then(data => {
              resolve(this._wrapData(data));
            })
            .catch(err => {
              reject(err);
            });
        });
    });
  }
}
