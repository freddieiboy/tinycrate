import React from 'react';
import ReactDOM from 'react-dom';

import LoginPage from './components/LoginPage';
import InventoryPage from './components/InventoryPage';
import CommentList from './components/CommentList';
import Comment from './components/Comment';
import CrateList from './components/CrateList';
import Crate from './components/Crate';
import CreatePage from './components/CreatePage';
import { Router, Route, Link, browserHistory } from 'react-router';

import firebase from 'firebase';
var FIREBASE_URL = "https://crackling-fire-5975.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var authData = ref.getAuth();

var unopenedCratesList = [];
var openedCratesList = [];

var data = [
  {id: 1, name: "Mary White", text: "Gifted you 1 Lyft Ride.", image: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"},
  {id: 2, name: "TechCrunch", text: "Digg CEO Gary Liu on the Rebirth of Digg and the Evolution of Content and...", image: "https://pbs.twimg.com/profile_images/615392662233808896/EtxjSSKk.jpg"},
  {id: 3, name: "DJ Khaled", text: "Major 🔑🔑🔑 Alert!!", image: "http://imc.ulximg.com/image/src/artist/1392850906_2f16e083616376c167fda25befb0472c.jpg/40b5f63611a9262fc955282ec0ec47f7/1392850906_dj_khaled_27.jpg"}
];


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
    unopenedCrates.orderByChild("opened").equalTo(false).on("child_added", function(snapshot) {
        console.log(snapshot.val());
        var crate = snapshot.val();
        crate.key = snapshot.key();
        unopenedCratesList.push(crate);
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
    return (
      <div>
        <div className="homeHeader">
          <div style={{color: 'white'}} onClick={this.showInventory}>TinyCrate</div>
        </div>

        <div className="container-fluid body-content-home">
          <CrateList data={this.state.data} onDelete={this.deleteObj} />
        </div>

        <footer>
          <p style={{color: 'white', float: 'right', paddingTop: '10px', paddingBottom: '10px', paddingRight: '15px'}} onClick={this.showCreate}>New Crate</p>
        </footer>
      </div>
    );
  }




});

module.exports = App;

// from tinycrate.js

ref.onAuth(function(authData) {
  if (authData) {
    ref.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData),
      profileImageURL: getProfileImageURL(authData)
    });
  } else {
    renderLogin();
  }
});

function getName(authData) {
  switch(authData.provider) {
    case 'twitter':
    return authData.twitter.displayName;
    case 'facebook':
    return authData.facebook.displayName;
  }
}

function getProfileImageURL(authData) {
  switch(authData.provider) {
    case 'twitter':
    return authData.twitter.profileImageURL;
    case 'facebook':
    return authData.facebook.profileImageURL;
  }
}

if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
} else {
  console.log("User is logged out");
  renderLogin();
}
