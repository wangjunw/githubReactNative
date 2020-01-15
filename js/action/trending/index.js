import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData, _projectModels} from '../ActionUtil';
/**
 * 获取最热数据的异步action
 * @param {string} languageName
 * @param {string} url：接口地址
 */
export function onLoadTrendingData(languageName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({type: Types.LOAD_TRENDING, languageName});
    let dataStore = new DataStore();
    dataStore
      .fetchData(url, FLAG_STORAGE.flag_trending, favoriteDao)
      .then(res => {
        handleData(
          Types.LOAD_TRENDING_SUCCESS,
          dispatch,
          languageName,
          res,
          pageSize,
          favoriteDao,
        );
      })
      .catch(error => {
        dispatch({type: Types.LOAD_TRENDING_FAIL, languageName, error});
      });
  };
}

/**
 * 上拉加载更多
 * @param {string} languageName 语言
 * @param {number} pageNo 当前页数
 * @param {number} pageSize 每页加载的条数
 * @param {Array} dataArr 原始数据，即全部数据
 * @param {Function} callback 加载完成要执行的回调
 */
export function onLoadMoreTrending(
  languageName,
  pageNo,
  pageSize,
  dataArr = [],
  favoriteDao,
  callback,
) {
  return dispatch => {
    // 因为接口是一次请求全部数据，这里只是模拟上拉加载更多的效果，每次截取相应的数据进行展示
    setTimeout(() => {
      if ((pageNo - 1) * pageSize >= dataArr.length) {
        if (typeof callback === 'function') {
          callback('已经没有更多数据了！');
        }
        dispatch({
          type: Types.LOAD_MORE_TRENDING_FAIL,
          error: 'no more',
          languageName: languageName,
          pageNo: --pageNo,
          projectModels: dataArr,
        });
      } else {
        // 不到最后一页
        let max =
          pageSize * pageNo > dataArr.length
            ? dataArr.length
            : pageSize * pageNo;
        _projectModels(dataArr.slice(0, max), favoriteDao, projectModels => {
          dispatch({
            type: Types.LOAD_MORE_TRENDING_SUCCESS,
            languageName,
            pageNo,
            projectModels,
          });
        });
      }
    }, 500);
  };
}
