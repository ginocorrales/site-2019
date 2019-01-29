import { applyMiddleware, combineReducers, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import authReducer from './auth/reducer';
import errorReducer from './error/reducer';
import registrationReducer from './registration/reducer';
import userReducer from './user/reducer';
import rsvpReducer from './rsvp/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  error: errorReducer,
  registration: registrationReducer,
  user: userReducer,
  rsvp: rsvpReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk, logger));

export default store;
