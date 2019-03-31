// @flow
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as storage from 'redux-storage';
import immutableMerger from 'redux-storage-merger-immutablejs';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers';

const isProduction = process.env.NODE_ENV === 'production';

const loggerMiddleware = createLogger({
  collapsed: (getState, action) => !action.error,
});

const rootReducer = storage.reducer(combineReducers(reducers), immutableMerger);

const middleware = isProduction
  ? applyMiddleware(thunkMiddleware)
  : applyMiddleware(thunkMiddleware, loggerMiddleware);

// TODO: doesn't appear to work at the moment
// try https://github.com/jhen0409/react-native-debugger/blob/master/docs/getting-started.md
const composeEnhancers = composeWithDevTools({});

export default () => {
  return createStore(
    rootReducer,
    composeEnhancers(middleware)
  );
};
