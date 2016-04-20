import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import crates from './modules/crates';
import NewCrates from './modules/NewCrates';
import FireRef from './modules/FireRef';
import FireConfig from './modules/FireConfig';
import userAuth from './modules/userAuth';
import Onboarding from './modules/Onboarding';

export default combineReducers({
  Onboarding,
  userAuth,
  FireConfig,
  NewCrates,
  crates,
  router
})
