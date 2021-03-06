import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Dashboard from 'components/Dashboard';
import LoginContainer from 'components/Login/LoginContainer';
import Profile from 'components/Profile/ProfileContainer';
import InventoryPage from 'components/InventoryPage';
import OpenCrate from 'components/OpenCrate/OpenCrateContainer';
import NotFound from 'components/NotFound';
import Onboarding from 'components/Onboarding/OnboardingContainer';
import Settings from 'components/Settings';
import NewCrate from 'components/NewCrates/NewCrate';
import Desktop from 'components/Desktop';

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout/CoreLayout';
import HomeView from 'views/HomeView/HomeView';

export default (store) => (
  <Route>
    <Route path='desktop' component={Desktop} />
    <Route path='getting-started' component={Onboarding} />
    <Route path='login' component={LoginContainer} />
    <Route path='/' component={CoreLayout}>
      <IndexRoute component={Dashboard} />
      <Route path='new-crate' component={NewCrate} />
      <Route path='user/:userId' component={Profile} />
      <Route path='crate/:crateId' component={OpenCrate} />
      {/*<Route path='test' component={HomeView} />*/}
      <Route path='settings' component={Settings} />
      <Route path='*' component={NotFound} />
    </Route>
  </Route>
);

// <Route path='/' component={CoreLayout}>
//   <IndexRoute component={HomeView} />
// </Route>

//NOTE: this is exported to => src/main.js
