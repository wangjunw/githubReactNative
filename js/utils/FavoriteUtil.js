import {FLAG_STORAGE} from '../expand/dao/DataStore';

export default class Utils {
  /**
   * 检查item是否被收藏
   */
  static checkFavorite(item, keys = []) {
    if (!keys) {
      return false;
    }
    for (let i = 0, len = keys.length; i < len; i++) {
      let id = item.id ? item.id : item.fullName;
      if (id.toString() === keys[i]) {
        return true;
      }
    }
    return false;
  }

  // 收藏按钮单击回调函数
  static onFavorite(favoriteDao, item, isFavorite, flag) {
    console.log('item, isFavorite: ', item, isFavorite);

    const key =
      flag === FLAG_STORAGE.flag_trending ? item.fullName : item.id.toString();
    if (isFavorite) {
      favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
    } else {
      favoriteDao.removeFavoriteItem(key);
    }
  }

  // 判断当前搜索关键字是否存在于最热的标签中
  static checkKeyIsExist(keys, inputKey) {
    for (let i = 0, len = keys.length; i < len; i++) {
      if (inputKey.toLowerCase() === keys[i].name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }
}
