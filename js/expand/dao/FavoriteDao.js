import AsyncStorage from '@react-native-community/async-storage';

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
  constructor(flag) {
    // 区分最热模块和趋势模块
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }
  /**
   *
   * @param {string} key
   * @param {*} value
   * @param {Function} callback
   */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, err => {
      if (!err) {
        // 更新key
        this.updateFavoriteKeys(key, true);
      }
    });
  }
  /**
   * 更新favorite key集合
   * @param {string} key
   * @param {boolean} isAdd true：添加 false：删除
   */
  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) {
          if (index === -1) {
            favoriteKeys.push(key);
          }
        } else {
          if (index !== -1) {
            favoriteKeys.splice(index, 1);
          }
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
      }
    });
  }

  /**
   * 获取所有收藏对应的key
   */
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (err, result) => {
        if (!err) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * 取消收藏，移除已经收藏的项目
   */
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (err, result) => {
      if (!err) {
        this.updateFavoriteKeys(key, false);
      }
    });
  }

  /**
   * 获取所有收藏项
   */
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys()
        .then(keys => {
          let items = [];
          if (keys) {
            AsyncStorage.multiGet(keys, (err, stores) => {
              try {
                stores.map((result, i, store) => {
                  let key = store[i][0];
                  let value = store[i][1];
                  if (value) {
                    items.push(JSON.parse(value));
                  }
                });
                resolve(items);
              } catch (e) {
                reject(e);
              }
            });
          } else {
            resolve(items);
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}
