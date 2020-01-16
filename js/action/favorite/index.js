import Types from '../types';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';
/**
 * 收藏模块action
 * @param flag 标识
 * @param isLoading 是否加载中
 */
export function onLoadFavoriteData(flag, isLoading) {
  return dispatch => {
    if (isLoading) {
      dispatch({type: Types.LOAD_FAVORITE, storeName: flag});
    }
    new FavoriteDao(flag)
      .getAllItems()
      .then(data => {
        let result = [];
        for (let i = 0, len = data.length; i < len; i++) {
          result.push(new ProjectModel(data[i], true));
        }
        dispatch({
          type: Types.LOAD_FAVORITE_SUCCESS,
          projectModels: result,
          storeName: flag,
        });
      })
      .catch(err => {
        dispatch({type: Types.LOAD_FAVORITE_FAIL, err: err, storeName: flag});
      });
  };
}
