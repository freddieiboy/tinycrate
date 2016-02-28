import React from 'react';
import CommentList from './CommentList';
import { Router, Route, Link, browserHistory } from 'react-router';
var FIREBASE_URL = "https://crackling-fire-5975.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var openedCratesList = [];

var InventoryPage = React.createClass({
  getInitialState: function() {
    return {data: [],
      user: {}
    };
  },
  logout: function(event) {
    ref.unauth();
    browserHistory.push("/login");
  },
  componentDidMount: function() {
    var itself = this;
    var openedCrates = new Firebase(FIREBASE_URL + "/crates");
    openedCratesList = [];
    var user = ref.getAuth();
    
    openedCrates.orderByChild("recipientUId").equalTo(user.uid).on("child_added", function(snapshot) {
      var crate = snapshot.val();
      crate.key = snapshot.key();
      if(crate.opened === true) {
          openedCratesList.push(crate);
      }
      itself.setState({data:  openedCratesList});
    });
    
    openedCrates.orderByChild("public").equalTo(true).on("child_added", function(snapshot) {
      var crate = snapshot.val();
      crate.key = snapshot.key();
      if(crate.opened === true) {
          openedCratesList.push(crate);
      }
      itself.setState({data:  openedCratesList});
    });
  
    var userRef;
    userRef = ref.child('users').child(user.uid);
    userRef.once('value', function (snap) {
      user = snap.val();
      if (!user) {
        return;
      }
      itself.setState({user: user});
    });
},
  showHome: function(event) {
    browserHistory.push("/");
  },
  render: function() {
    return (

      <div>
        <header>
          <div style={{color: 'white'}}><img className="user-avatar" src={this.state.user.profileImageURL}/>{this.state.user.name}
          <button style={{float: 'right'}} onClick={this.logout}>Logout</button>
          </div>
        </header>
        <div className="container-fluid body-content">
          <CommentList data={openedCratesList} />
        </div>
        <footer>
          <p style={{color: 'white', float: 'right', paddingTop: '10px', paddingBottom: '10px', paddingRight: '15px'}} onClick={this.showHome}>Go Back</p>
        </footer>
      </div>
    );
  }
});

module.exports = InventoryPage;
