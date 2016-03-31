import React from 'react';
import Empty from './Empty';
import ActionBar from './ActionBar';
import ProfileCrateList from './Crates/ProfileCrateList';
import ProfileCrate from './Crates/ProfileCrate';
import { Router, Route, Link, browserHistory } from 'react-router';
import AbsoluteGrid from 'react-absolute-grid';
var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var userRef;
var recentGifteesList = [];

var ProfilePage = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      user: {}
    };
  },
  subscribe: function(event) {
    alert('Coming soon!');
  },
  showCreate: function(event) {
    browserHistory.push("/create");
  },
  componentDidMount: function() {
    var itself = this;
    var profileFeed = new Firebase(FIREBASE_URL + "/crates");
    recentGifteesList = [];
    getUserByUsername(this.props.params.userId, function(user) {
      if (this.isMounted()) {
        itself.setState({user: user});
      }
      userRef = ref.child('users').child(user.uid);
      getRecentGiftees(function() {
        itself.setState({data:  recentGifteesList});
      });
    }.bind(this));
  },
  showHome: function(event) {
    browserHistory.push("/");
  },
  onOpen: function(username) {
    // TODO: route in browser changes but page doesn't load
    browserHistory.push("/user/" + username);
  },
  render: function() {
    var emptyState;
    if (this.state.data.length == 0) {
      emptyState = <Empty />;
    } else {
      emptyState = '';
    }
    
    return (
      <div className="profile-page-holder">
      <div className="homeHeader" style={styles.homeHeader}>
        <h5 className="logoType">Back</h5>
        <div className="inventoryAction float-right" onClick={this.showInventory}>
          <div className="up-label float-right" style={{ color: 'white', padding: '5px 20px 0 0' }}>
            <p style={{color: '#000'}}>X</p>
          </div>
        </div>
      </div>
      
      <header>
        <div className="container" style={{height: '100%'}}>
          <div className="row" style={{height: '100%'}}>
            <div className="column " style={{height: '100%'}}>
              <div className="user-avatar-holder" style={{height: '100%'}}>
                <ProfileCrate profileImageURL={this.state.user.profileImageURL} />
              </div>
            </div>
            <div className="column user-info-holder">
              <div className="info">
                <div className="name ">{this.state.user.name}</div>
                <div className="name ">@{this.state.user.username}</div>
                <div className="count">gifted: {this.state.user.giftedCount}</div>
                <div className="count">unwrapped: {this.state.user.unwrappedCount}</div>
              </div>
            </div>
            <div className="column button-holder" style={{height: '100%'}}>
              <button style={{float: 'right'}} onClick={this.subscribe}>Add Gifter +</button>
            </div>
          </div>
        </div>
      </header>
      
        <div style={{padding: '22px'}} className="container-fluid body-content">
          <AbsoluteGrid items={this.state.data} displayObject={(<ProfileCrateList onOpen={this.onOpen} />)} responsive={true} itemHeight={100} itemWidth={92} />
          {emptyState}
        </div>
        <ActionBar showCreate={this.showCreate} />
      </div>
    );
  }
});

function getRecentGiftees(callback) {
  userRef.child('giftees').orderByChild('giftedAt').on('child_added', function(snapshot) {
    getUserByUid(snapshot.key(), function(user) {
      recentGifteesList.push(user);
      callback();
    });
  });
}

function getUserByUsername(username, callback) {
  ref.child('users').orderByChild('username').equalTo(username).once('value', function(snap) {
    var userObj = snap.val();
    var key = Object.keys(userObj)[0];
    var user = userObj[key];
    user.uid = key;
    callback(user);
  });
}

function getUserByUid(uid, callback) {
  ref.child('users').child(uid).once('value', function(snap) {
    var user = snap.val();
    user.key = uid;
    callback(user);
  });
}

module.exports = ProfilePage;

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