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
import { Router, Route, Link, browserHistory } from 'react-router';
import AbsoluteGrid from 'react-absolute-grid';

import firebase from 'firebase';
var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var authData = ref.getAuth();

var unopenedCratesList = [];
var openedCratesList = [];

var data = [
  {id: 1, name: "Mary White", text: "Gifted you 1 Lyft Ride.", image: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"},
  {id: 2, name: "TechCrunch", text: "Digg CEO Gary Liu on the Rebirth of Digg and the Evolution of Content and...", image: "https://pbs.twimg.com/profile_images/615392662233808896/EtxjSSKk.jpg"},
  {id: 3, name: "DJ Khaled", text: "Major 🔑🔑🔑 Alert!!", image: "http://imc.ulximg.com/image/src/artist/1392850906_2f16e083616376c167fda25befb0472c.jpg/40b5f63611a9262fc955282ec0ec47f7/1392850906_dj_khaled_27.jpg"}
];

const styles = {
  homeHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 65,
    padding: '15px 22px 38px 28px'
  },
  homeFooter: {
    height: '4em',
    backgroundColor: green.lightColor// TODO: going to use the users color
  },
  optionsMenu: {
    position: 'absolute',
    top: '-2.5em',
    right: '2.5em',
    width: '5em',
    height: '5em',
    borderRadius: '50%',
    backgroundColor: '#fff',
    boxShadow: '1px 2px 4px 0px rgba(0,0,0,0.21)'
  },
  createIcon: {
    height: '2.5em',
    width: '2.5em',
    backgroundColor: pink.lightColor,
    borderRadius: 6
  }
}

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

      <footer className="homeFooter" style={styles.homeFooter}>
        <div className="optionsMenu actionButton animated pulse" onClick={this.showCreate} style={styles.optionsMenu}>
          <div className="actionIcon" style={styles.createIcon}></div>
          <div className="actionIcon" style={{fontSize: '2em', color: '#fff'}}>+</div>
        </div>
      </footer>
    </div>
  );
}

});

module.exports = App;

// from tinycrate.js

function login() {
  browserHistory.push("login");
}

if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
} else {
  console.log("User is logged out");
  login();
}
