import React from 'react';
import { render } from 'react-dom';
import App from './app'
import InventoryPage from './components/InventoryPage';
import CreatePage from './components/CreatePage';
import { Router, Route, Link, browserHistory } from 'react-router';

import css from '!style!css!sass!./css/base.scss';
import '!style!css!sass!milligram/dist/milligram.css';

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
    <Route path="/inventory" component={InventoryPage}/>
    <Route path="/create" component={CreatePage}/>
  </Router>
), document.getElementById('content'))
