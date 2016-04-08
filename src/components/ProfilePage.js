import React, {Component} from 'react';
import {bindActionCreators, store, getState} from 'redux';
import {push} from 'react-router-redux';
import { connect } from 'react-redux';
import * as userAuth from '../redux/modules/userAuth';
import Empty from './Empty';
import CommentList from './CommentList';
import ProfileCrateList from './Crates/ProfileCrateList';
import ProfileCrate from './Crates/ProfileCrate';
import { Router, Route, Link, browserHistory } from 'react-router';
import AbsoluteGrid from 'react-absolute-grid';
var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var userRef;
var openedCratesRef = ref.child('crates');
var recentGifteesList = [];

var subscriptionsList = [];
var openedCratesList = [];

var ProfileTabs = {
  SUBSCRIPTIONS: 0,
  RECENT_CRATES: 1,
};

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user: {},
      currentTab: ProfileTabs.SUBSCRIPTIONS,
      isMe: false
    }
  }
  loadProfileForUser = (userId) => {
    subscriptionsList = [];
    openedCratesList = [];
    var isMe = false;
    getUserByUsername(userId, user => {
      userRef = ref.child('users').child(user.uid);
      getSubscriptions();
      
      if(user.uid === this.props.store.userAuth.uid) {
        isMe = true;
        getRecentCrates(user.uid);
      }
      
      this.setState({user: user, data: subscriptionsList, isMe: isMe});
      
      if(isMe) {
        this.setState({currentTab: ProfileTabs.RECENT_CRATES});
      }
      
    })
  }
  profileButton = (event) => {
    if(this.state.isMe) {
      // TODO: show settings page
      alert("Settings coming soon.");
    } else {
      subscribeToUser(this.state.user.username, this.props.store.userAuth.uid);
      alert("You are now subscribed to " + this.state.user.username);
    }
  }
  recentCratesTab = (event) => {
    this.setState({currentTab:  ProfileTabs.RECENT_CRATES});
  }
  subscriptionsTab = (event) => {
    this.setState({currentTab:  ProfileTabs.SUBSCRIPTIONS});
  }
  componentWillReceiveProps = (nextProps) => {
    this.loadProfileForUser(nextProps.params.userId);
  }
  componentDidMount = () => {
    this.loadProfileForUser(this.props.params.userId);
  }
  onOpen = (username) => {
    this.props.dispatch(push("/user/" + username));
  }
  render() {
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

      <div className="Grid Grid--gutters u-textCenter" style={{height: '70%'}}>
        <div className="Grid-cell" style={{height: '100%'}}>
          <div className="user-avatar-holder" style={{height: '100%'}}>
            <ProfileCrate profileImageURL={this.state.user.profileImageURL} />
          </div>
        </div>
        <div className="Grid-cell user-info-holder">
          <div className="info">
            <div className="name ">{this.state.user.name}</div>
            <div className="name ">@{this.state.user.username}</div>
          </div>
        </div>
        <div className="Grid-cell button-holder" style={{height: '100%'}}>
          <button style={{float: 'right'}} onClick={this.profileButton}>
            {this.state.isMe ? 'Settings' : 'Add Gifter +'} 
          </button>
        </div>
      </div>
      <div className="Grid Grid--gutters u-textCenter statsHeader" style={{height: '50%'}}>
        <div className="Grid-cell user-info-holder">
          <div className="info">
            <div className="count ">1</div>
            <div className="count ">Level</div>
          </div>
        </div>
        <div className="Grid-cell user-info-holder">
          <div className="info">
            <div className="count ">{this.state.user.unwrappedCount}</div>
            <div className="count ">Unwrapped</div>
          </div>
        </div>
        <div className="Grid-cell user-info-holder">
          <div className="info">
            <div className="count ">{this.state.user.giftedCount}</div>
            <div className="count ">Gifted</div>
          </div>
        </div>
      </div>

      </header>

        <div style={{padding: '22px'}} className="container-fluid body-content">

        <div className="Grid Grid--gutters u-textCenter">
          {this.state.isMe ?
          <div className="Grid-cell">
            <h5 style={this.state.currentTab == ProfileTabs.RECENT_CRATES ? styles.activeTab : styles.inactiveTab} onClick={this.recentCratesTab}>Recent Crates</h5>
            {this.state.isMe}
          </div>
          : ''
          }
          <div className="Grid-cell">
            <h5 style={this.state.currentTab == ProfileTabs.SUBSCRIPTIONS ? styles.activeTab : styles.inactiveTab} onClick={this.subscriptionsTab}>Subscriptions</h5>
          </div>
        </div>

        {profileTabContent}

        </div>
      </div>
    );
  }
}

function getSubscriptions() {
  userRef.child('subscriptions').orderByChild('subscribedAt').on('child_added', function(snapshot) {
    getUserByUsername(snapshot.key(), function(user) {
      subscriptionsList.push(user);
    });
  });
}

const getUserByUsername = (username, callback) => {
  ref.child('users').orderByChild('username').equalTo(username).once('value', (snap) => {
    var userObj = snap.val();
    var key = Object.keys(userObj)[0];
    var user = userObj[key];
    user.uid = key;
    user.key = key;
    callback(user);
  });
}

function subscribeToUser(username, authUid) {
  userRef = ref.child('users').child(authUid);
  userRef.child("subscriptions").child(username).transaction(function(user) {
    return {
      subscribedAt: Firebase.ServerValue.TIMESTAMP
    };
  });
}

function getRecentCrates(uid) {
  openedCratesRef.orderByChild("recipientUId").equalTo(uid).on("child_added", function(snapshot) {
    var crate = snapshot.val();
    crate.id = snapshot.key();
    if(crate.opened === true) {
      openedCratesList.push(crate);
    }
    openedCratesList.reverse();
  });
}

// const getUserByUid = (uid, callback) => {
//   ref.child('users').child(uid).once('value', (snap) => {
//     var user = snap.val();
//     user.key = uid;
//     callback(user);
//   });
// }

const mapStateToProps = (state) => ({
  store: {
  userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(userAuth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)