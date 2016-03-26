import React from 'react';
import { render } from 'react-dom';
import App from './app'
import LoginPage from './components/LoginPage';
import InventoryPage from './components/InventoryPage';
import CreatePage from './components/CreatePage';
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';

import css from '!style!css!sass!./css/base.scss';
import '!style!css!sass!milligram/dist/milligram.css';
import '!style!css!sass!csshake/dist/csshake.css';


render((
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
    <Route path="/login" component={LoginPage}/>
    <Route path="/inventory" component={InventoryPage}/>
    <Route path="/create" component={CreatePage}/>
  </Router>
), document.getElementById('content'))
