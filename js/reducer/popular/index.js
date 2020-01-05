import Types from '../../action/types';
const defaultState = {};

/**
 * language是动态的，所以需要[action.languageName]
 * {
 *    java:{
 *      isLoading: true,
 *      items: []
 *    }
 * }
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    // 下拉刷新
    case Types.LOAD_POPULAR:
      return {
        ...state,
        [action.languageName]: {
          ...state[action.languageName],
          isLoading: true,
          hideLoadingMore: true,
        },
      };
    case Types.LOAD_POPULAR_SUCCESS:
      return {
        ...state,
        [action.languageName]: {
          ...state[action.languageName],
          projectModes: action.projectModes,
          items: action.items,
          isLoading: false,
          hideLoadingMore: false,
          pageNo: action.pageNo,
        },
      };
    case Types.LOAD_POPULAR_FAIL:
      return {
        ...state,
        [action.languageName]: {
          ...state[action.languageName],
          isLoading: false,
        },
      };
    // 上拉加载
    case Types.LOAD_MORE_POPULAR_SUCCESS:
      return {
        ...state,
        [action.languageName]: {
          ...state[action.languageName],
          projectModes: action.projectModes,
          hideLoadingMore: false,
          pageNo: action.pageNo,
        },
      };
    case Types.LOAD_MORE_POPULAR_FAIL:
      return {
        ...state,
        [action.languageName]: {
          ...state[action.languageName],
          hideLoadingMore: true,
          pageNo: action.pageNo,
        },
      };
    default:
      return state;
  }
}
