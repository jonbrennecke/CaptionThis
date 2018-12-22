// @flow
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as storage from 'redux-storage';
import immutableMerger from 'redux-storage-merger-immutablejs';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from './reducers';

const isProduction = process.env.NODE_ENV === 'production';

const loggerMiddleware = createLogger({
  collapsed: (getState, action) => !action.error,
});

const rootReducer = storage.reducer(combineReducers(reducers), immutableMerger);

const middleware = isProduction
  ? applyMiddleware(thunkMiddleware)
  : applyMiddleware(thunkMiddleware, loggerMiddleware);

export default createStore(rootReducer, middleware);
