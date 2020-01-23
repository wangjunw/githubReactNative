import Types from '../types';
import ThemeDao from '../../expand/dao/ThemeDao';
/**
 * 修改主题
 * @param {*} theme
 */
export function onThemeChange(theme) {
  return {type: Types.THEME_CHANGE, theme: theme};
}

/**
 * 初始化主体
 */
export function onThemeInit() {
  return dispatch => {
    new ThemeDao().getTheme().then(data => {
      dispatch(onThemeChange(data));
    });
  };
}

/**
 * 唤起主体选择界面
 */
export function onShowCustomThemeView(show) {
  console.log(show);
  return {type: Types.SHOW_THEME_VIEW, customThemeViewVisible: show};
}
