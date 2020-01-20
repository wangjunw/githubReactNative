import Types from '../../action/types';
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
const defaultState = {
  langs: [],
  keys: [],
};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.LOAD_LANGUAGE_SUCCESS:
      if (FLAG_LANGUAGE.flag_key === action.flag) {
        return {
          ...state,
          keys: action.langs,
        };
      } else {
        return {
          ...state,
          langs: action.langs,
        };
      }
    default:
      return state;
  }
}
