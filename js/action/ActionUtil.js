import ProjectModel from '../model/ProjectModel';
import Utils from '../utils/FavoriteUtil';
import {object} from 'prop-types';
/**
 * action相关的公共方法
 * @param {*} actionType
 * @param {*} dispatch
 * @param {*} languageName
 * @param {*} data
 * @param {*} pageSize
 * @param {*} favoriteDao
 * @param {*} params 扩展参数
 */
export const handleData = (
  actionType,
  dispatch,
  languageName,
  data,
  pageSize,
  favoriteDao,
  params,
) => {
  let fixItems = [];
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data;
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items;
    }
  }
  /**
   * 第一次要加载的数据，
   * 如果获取到的数据数量不够一页（即小于pageSize），就显示获取到的数据
   * 如果超过pageSize就截取pageSize个数据
   */
  let showItems =
    pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
  _projectModels(showItems, favoriteDao, projectModels => {
    dispatch({
      type: actionType,
      items: fixItems,
      projectModels,
      languageName,
      pageNo: 1,
      ...params,
    });
  });
};
// 对当前要显示的数据做包装
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = [];
  try {
    keys = await favoriteDao.getFavoriteKeys();
  } catch (e) {
    console.log(e);
  }
  let projectModels = [];

  for (let i = 0, len = showItems.length; i < len; i++) {
    projectModels.push(
      new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)),
    );
  }
  doCallback(callback, projectModels);
}

// 对调用callback做封装
export const doCallback = (callback, obj) => {
  if (typeof callback === 'function') {
    callback(obj);
  }
};
