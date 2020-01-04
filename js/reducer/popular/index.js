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
    case Types.LOAD_POPULAR:
      return {
        ...state,
        [action.languageName]: {
          ...state[action.languageName],
          isLoading: true,
        },
      };
    case Types.LOAD_POPULAR_SUCCESS:
      return {
        ...state,
        [action.languageName]: {
          ...state[action.languageName],
          items: action.items,
          isLoading: false,
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
    default:
      return state;
  }
}
