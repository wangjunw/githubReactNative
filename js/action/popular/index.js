import Types from '../types';
import DataStore from '../../expand/dao/DataStore';
/**
 * 获取最热数据的异步action
 * @param {string} languageName
 * @param {string} url：接口地址
 */
export function onLoadPopularData(languageName, url) {
  return dispatch => {
    dispatch({type: Types.LOAD_POPULAR, languageName});
    let dataStore = new DataStore();
    dataStore
      .fetchData(url)
      .then(res => {
        handleData(dispatch, languageName, res);
      })
      .catch(error => {
        dispatch({type: Types.LOAD_POPULAR_FAIL, languageName, error});
      });
  };
}

const handleData = (dispatch, languageName, data) => {
  dispatch({
    type: Types.LOAD_POPULAR_SUCCESS,
    items: data && data.data && data.data.items,
    languageName,
  });
};
