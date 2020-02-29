import Types from '../types';
import ArrayUtil from '../../utils/ArrayUtil';
const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'; //参数根据star数量排序
const CANCEL_TOKENS = [];
import {handleData, _projectModels, doCallback} from '../ActionUtil';
import Utils from '../../utils/FavoriteUtil';
/**
 * 搜索仓库名
 * @param {string} inputKey 搜索关键字
 * @param {string} token 用来取消搜索
 * @param {*} favoriteDao
 * @param popularKys 最热模块下所有的标签
 */
export function onSearch(
  inputKey,
  token,
  pageSize,
  favoriteDao,
  popularKeys,
  callback,
) {
  return dispatch => {
    dispatch({type: Types.SEARCH_REFRESH});
    fetch(getFetchUrl(inputKey))
      .then(res => {
        // 判断是否取消请求，不做响应处理
        return hasCancel(token) ? null : res.json();
      })
      .then(result => {
        // 判断是否取消请求，并且要执行取消
        if (hasCancel(token, true)) {
          console.log('用户取消任务，不做处理');
          return;
        }
        // 如果数据为空,表示失败
        if (!result || !result.items || result.items.length === 0) {
          dispatch({type: Types.SEARCH_FAIL, message: '没有找到相关项目'});
          doCallback(callback, '没有找到相关项目');
          return;
        }
        let items = result.items;
        handleData(
          Types.SEARCH_REFRESH_SUCCESS,
          dispatch,
          '',
          {data: items},
          pageSize,
          favoriteDao,
          {
            showBottomButton: !Utils.checkKeyIsExist(popularKeys, inputKey),
            inputKey,
          },
        );
      })
      .catch(e => {
        console.log(e);
        dispatch({type: Types.SEARCH_FAIL, error: e});
      });
  };
}

/**
 * 取消一个异步任务
 * @param {*} token
 */
export const onSearchCancel = token => {
  return dispatch => {
    CANCEL_TOKENS.push(token);
    dispatch({type: Types.SEARCH_CANCEL});
  };
};

/**
 * 上拉加载更多
 * @param {number} pageNo 当前页数
 * @param {number} pageSize 每页加载的条数
 * @param {Array} dataArr 原始数据，即全部数据
 * @param {} favoriteDao
 * @param {Function} callback 加载完成要执行的回调
 */
export function onSearchLoadMore(
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
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
          pageNo: --pageNo,
        });
      } else {
        // 不到最后一页
        let max =
          pageSize * pageNo > dataArr.length
            ? dataArr.length
            : pageSize * pageNo;
        _projectModels(dataArr.slice(0, max), favoriteDao, projectModels => {
          dispatch({
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageNo,
            projectModels,
          });
        });
      }
    }, 500);
  };
}

// 拼接接口地址
function getFetchUrl(key) {
  return API_URL + key + QUERY_STR;
}
// 请求是否被取消
function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtil.remove(CANCEL_TOKENS, token);
    return true;
  }
  return false;
}
