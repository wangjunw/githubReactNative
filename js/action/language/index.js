import LanguageDao from '../../expand/dao/LanguageDao';
import Types from '../../action/types';
/**
 * 加载语言标签
 */
export function onLoadLanguage(flagKey) {
  return async dispatch => {
    try {
      const langs = await new LanguageDao(flagKey).fetch();
      dispatch({
        type: Types.LOAD_LANGUAGE_SUCCESS,
        langs,
        flag: flagKey,
      });
    } catch (e) {
      console.log(e);
    }
  };
}
