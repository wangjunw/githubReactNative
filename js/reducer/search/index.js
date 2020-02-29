import Types from '../../action/types';
const defaultState = {
  showText: '搜索', // 搜索文案，点击变成取消
  items: [],
  isLoading: false, //是否显示loading
  projectModels: [], // 要显示的数据
  hideLoadingMore: true, //默认情况隐藏加载更多
  showBottomButton: false, //是否显示收藏按钮
};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    // 搜索及下拉刷新
    case Types.SEARCH_REFRESH:
      return {
        ...state,
        isLoading: true,
        hideLoadingMore: true,
        showBottomButton: false,
        showText: '取消',
      };
    case Types.SEARCH_REFRESH_SUCCESS:
      return {
        ...state,
        showBottomButton: action.showBottomButton,
        isLoading: false,
        hideLoadingMore: false,
        items: action.items,
        projectModels: action.projectModels,
        pageNo: action.pageNo,
        showText: '搜索',
        inputKey: action.inputKey,
      };
    case Types.LOAD_POPULAR_FAIL:
      return {
        ...state,
        isLoading: false,
        showText: '搜索',
      };
    case Types.SEARCH_CANCEL: //取消搜索
      return {
        ...state,
        isLoading: false,
        showText: '搜索',
      };
    // 上拉加载
    case Types.SEARCH_LOAD_MORE_SUCCESS:
      return {
        ...state,
        projectModels: action.projectModels,
        hideLoadingMore: false,
        pageNo: action.pageNo,
      };
    case Types.SEARCH_LOAD_MORE_FAIL:
      return {
        ...state,
        hideLoadingMore: true,
        pageNo: action.pageNo,
      };
    default:
      return state;
  }
}
