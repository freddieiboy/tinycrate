import React from 'react';
import { render } from 'react-dom';
import App from './App';
import Dashboard from './components/Dashboard'
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import InventoryPage from './components/InventoryPage';
import CreatePage from './components/CreatePage';
import { Router, Route, Link, browserHistory, hashHistory, IndexRoute } from 'react-router';

import css from '!style!css!sass!./css/base.scss';
import '!style!css!sass!milligram/dist/milligram.css';
import '!style!css!sass!csshake/dist/csshake.css';


render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard}/>
      <Route path="login" component={LoginPage}/>
      <Route path="inventory" component={InventoryPage}/>
      <Route path="create" component={CreatePage}/>
      <Route path="user/:userId" component={ProfilePage}/>
    </Route>
  </Router>
), document.getElementById('content'))
