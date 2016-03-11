import React from 'react';
import ReactDOM from 'react-dom';

import LoginPage from './components/LoginPage';
import InventoryPage from './components/InventoryPage';
import CommentList from './components/CommentList';
import Comment from './components/Comment';
import CrateList from './components/Crates/CrateList';
import {green, pink} from './components/Crates/CrateUtils';
import Crate from './components/Crates/Crate';
import CreatePage from './components/CreatePage';
import Empty from './components/Empty';
import ActionBar from './components/ActionBar';
import { Router, Route, Link, browserHistory } from 'react-router';
import AbsoluteGrid from 'react-absolute-grid';

import firebase from 'firebase';
var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var authData = ref.getAuth();

var unopenedCratesList = [];
var openedCratesList = [];

var App = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  showInventory: function(event) {
    browserHistory.push("inventory");
  },
  showCreate: function(event) {
    browserHistory.push("create");
  },
  componentDidMount: function() {
    var itself = this;
    var unopenedCrates = new Firebase(FIREBASE_URL + "/crates");
    unopenedCratesList = [];
    //TODO: refactor these two functions. console.log is being called like 200 times. why?
    unopenedCrates.orderByChild("recipientUId").equalTo(authData.uid).on("child_added", function(snapshot) {
      var crate = snapshot.val();
      crate.key = snapshot.key();
      if(crate.opened === false) {
        unopenedCratesList.push(crate);
      }
      itself.setState({data:  unopenedCratesList});
    });

    unopenedCrates.orderByChild("public").equalTo(true).on("child_added", function(snapshot) {
      var crate = snapshot.val();
      crate.key = snapshot.key();
      if(crate.opened === false) {
        unopenedCratesList.push(crate);
      }
      itself.setState({data:  unopenedCratesList});
    });
  },
  deleteObj: function(data_id) {
    var itself = this;
    console.log("deleting: " + data_id);

    var links = this.state.data;
    console.log("OLD LINKS: " + JSON.stringify(links));

    var newlinks = links.filter(function(elem) {
      return elem.key != data_id;
    });

    console.log("NEW LINKS: " + JSON.stringify(newlinks));

    itself.setState({data: newlinks});
  },
  render: function() {
    var emptyState;
    if (this.state.data.length == 0) {
      emptyState = <Empty />;
    } else {
      emptyState = '';
    }

    return (
      <div>
        <div className="homeHeader" style={styles.homeHeader}>
          <h5 className="logoType">TinyCrate</h5>
          <div className="inventoryAction float-right" onClick={this.showInventory}>
            <div className="up-label float-right" style={{ color: 'white', padding: '5px 20px 0 0' }}>
              <p style={{color: '#000'}}>Inventory</p>
            </div>
          </div>
        </div>

        <div style={{padding: '22px'}} className="container-fluid body-content-home">
          <AbsoluteGrid items={this.state.data} displayObject={(<CrateList comment={this.state.data} onDelete={this.deleteObj} color={this.pickColor}/>)} responsive={true} itemHeight={100} itemWidth={92} />
          {emptyState}
        </div>
        <ActionBar showCreate={this.showCreate} />
      </div>
    );
  }

});

module.exports = App;

const styles = {
  homeHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 65,
    padding: '15px 22px 38px 28px'
  }
}

function login() {
  browserHistory.push("login");
}

if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
} else {
  console.log("User is logged out");
  login();
}
