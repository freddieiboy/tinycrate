import React from 'react';
import Empty from './Empty';
import ActionBar from './ActionBar';
import ProfileCrateList from './Crates/ProfileCrateList';
import ProfileCrate from './Crates/ProfileCrate';
import CommentList from './CommentList';
import { Router, Route, Link, browserHistory } from 'react-router';
import AbsoluteGrid from 'react-absolute-grid';
var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var authData = ref.getAuth();
var userRef;
var openedCratesRef = ref.child('crates');
var subscriptionsList = [];
var openedCratesList = [];
var isMe = false;

var ProfileTabs = {
  SUBSCRIPTIONS: 0,
  RECENT_CRATES: 1,
};

var ProfilePage = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      user: {},
      currentTab: ProfileTabs.SUBSCRIPTIONS
    };
  },
  profileButton: function(event) {
    if(isMe) {
      // TODO: show settings page
      alert("Settings coming soon.");
    } else {
      subscribeToUser(this.state.user.username);
      alert("You are now subscribed to " + this.state.user.username);
    }
  },
  recentCratesTab: function(event) {
    this.setState({currentTab:  ProfileTabs.RECENT_CRATES});
  },
  subscriptionsTab: function(event) {
    this.setState({currentTab:  ProfileTabs.SUBSCRIPTIONS});
  },
  showCreate: function(event) {
    browserHistory.push("/create");
  },
  componentDidMount: function() {
    var itself = this;
    subscriptionsList = [];
    openedCratesList = [];
    getUserByUsername(this.props.params.userId, function(user) {
      if (this.isMounted()) {
        itself.setState({user: user});
        if(this.state.user.uid == authData.uid) {
          isMe = true;
          itself.setState({currentTab: ProfileTabs.RECENT_CRATES});
          getRecentCrates(this.state.user.uid, function() {
            itself.setState({data:  openedCratesList});
          });
        }
      }
      userRef = ref.child('users').child(user.uid);
      getSubscriptions(function() {
        itself.setState({data:  subscriptionsList});
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

    var profileTabContent;
    if(this.state.currentTab == ProfileTabs.SUBSCRIPTIONS) {
      profileTabContent = 
      <AbsoluteGrid items={this.state.data} displayObject={(<ProfileCrateList onOpen={this.onOpen} />)} responsive={true} itemHeight={100} itemWidth={92} />
      {emptyState};
    } else if(this.state.currentTab == ProfileTabs.RECENT_CRATES) {
      profileTabContent = <CommentList data={openedCratesList} />;
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
              <button style={{float: 'right'}} onClick={this.profileButton}>
              {isMe ? 'Settings' : 'Add Gifter +'} 
              </button>
            </div>
          </div>
        </div>
      </header>
      
        <div style={{padding: '22px'}} className="container-fluid body-content">
        
        <div className="row">
        {isMe ?
          <div className="column" style={{height: '100%'}}>
            <h5 style={this.state.currentTab == ProfileTabs.RECENT_CRATES ? styles.activeTab : styles.inactiveTab} onClick={this.recentCratesTab}>Recent Crates</h5>
          </div>
          : ''
        }
          <div className="column">
            <h5 style={this.state.currentTab == ProfileTabs.SUBSCRIPTIONS ? styles.activeTab : styles.inactiveTab} onClick={this.subscriptionsTab}>Subscriptions</h5>
          </div>
        </div>

        {profileTabContent}

        </div>
        <ActionBar showCreate={this.showCreate} />
      </div>
    );
  }
});

function getSubscriptions(callback) {
  userRef.child('subscriptions').orderByChild('subscribedAt').on('child_added', function(snapshot) {
    getUserByUsername(snapshot.key(), function(user) {
      subscriptionsList.push(user);
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
    user.key = key;
    callback(user);
  });
}

// function getUserByUid(uid, callback) {
//   ref.child('users').child(uid).once('value', function(snap) {
//     var user = snap.val();
//     user.key = uid;
//     callback(user);
//   });
// }

function subscribeToUser(username) {
  userRef.child("subscriptions").child(username).transaction(function(user) {
    return {
      subscribedAt: Firebase.ServerValue.TIMESTAMP
    };
  });
}

function getRecentCrates(uid, callback) {
  openedCratesRef.orderByChild("recipientUId").equalTo(uid).on("child_added", function(snapshot) {
    var crate = snapshot.val();
    crate.key = snapshot.key();
    if(crate.opened === true) {
      openedCratesList.push(crate);
    }
    openedCratesList.reverse();
    callback();
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
  },
  activeTab: {
    color: '#8F9393'
  },
  inactiveTab: {
    color: '#D7D9DA'
  }
}