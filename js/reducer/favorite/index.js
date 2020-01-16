import Types from '../../action/types';
const defaultState = {};
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.LOAD_FAVORITE:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
        },
      };
    case Types.LOAD_FAVORITE_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
          projectModels: action.projectModels,
        },
      };
    case Types.LOAD_FAVORITE_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
        },
      };
    default:
      return state;
  }
}
