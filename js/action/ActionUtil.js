/**
 * action相关的公共方法
 * @param {*} actionType
 * @param {*} dispatch
 * @param {*} languageName
 * @param {*} data
 * @param {*} pageSize
 */
export const handleData = (
  actionType,
  dispatch,
  languageName,
  data,
  pageSize,
) => {
  let fixItems = [];
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data.items;
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items;
    }
  }
  /**
   * 第一次要加载的数据，
   * 如果获取到的数据数量不够一页（即小于pageSize），就显示获取到的数据
   * 如果超过pageSize就截取pageSize个数据
   */
  dispatch({
    type: actionType,
    items: fixItems,
    projectModes:
      pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),
    languageName,
    pageNo: 1,
  });
};
