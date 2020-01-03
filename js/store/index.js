import {applyMiddleware, createStore} from 'redux';
import reducers from '../reducer';
import thunk from 'redux-thunk';
import {middleware} from '../navigator/AppNavigator';

const middlewares = [middleware, thunk];

export default createStore(reducers, applyMiddleware(...middlewares));
