import React from 'react';
import { Route, IndexRoute } from 'react-router';

// import {App} from 'components/App';
import Dashboard from 'components/Dashboard';
import LoginPage from 'components/LoginPage';
import ProfilePage from 'components/ProfilePage';
import InventoryPage from 'components/InventoryPage';
import CratePage from 'components/CratePage';
// import CreatePage from 'components/CreatePage';
import NotFound from 'components/NotFound';

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout/CoreLayout';
import HomeView from 'views/HomeView/HomeView';

export default (store) => (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={Dashboard} />
    <Route path='login' component={LoginPage} />
    <Route path='inventory' component={InventoryPage}/>
    <Route path='user/:userId' component={ProfilePage}/>
    <Route path='crate/:crateId' component={CratePage}/>
    <Route path='test' component={HomeView} />
    <Route path='*' component={NotFound} />
  </Route>
);

// <Route path='/' component={CoreLayout}>
//   <IndexRoute component={HomeView} />
// </Route>

//NOTE: this is exported to => src/main.js
