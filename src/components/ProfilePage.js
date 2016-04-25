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

var subscriptionsList = [];
var collectionCratesList = [];
var currentProfileId;

var ProfileTabs = {
  SUBSCRIPTIONS: 0,
  MY_COLLECTION: 1,
};

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionData: [],
      collectionCrateData: [],
      user: {},
      //NOTE: Alec, set the state only w/ setState on componentDidMount or componentWillMount. Plus a null value works better than 0? Don't know why yet.
      // currentTab: ProfileTabs.SUBSCRIPTIONS,
      currentTab: null,
      isMe: false,
      isBlocked: false
    }
  }
  componentDidMount = () => {
    this.setState({currentTab: ProfileTabs.SUBSCRIPTIONS})
    currentProfileId = this.props.params.userId;
    this.loadProfileForUser(currentProfileId);
  }
  componentWillReceiveProps = (nextProps) => {
    //TODO: add a shouldComponentUpdate to control performance
    if(currentProfileId === nextProps.params.userId) {
      return;
    }
    this.loadProfileForUser(nextProps.params.userId);
  }
  loadProfileForUser = (userId) => {
    subscriptionsList = [];
    collectionCratesList = [];
    var isMe = false;
    var isBlocked = false;
    getUserByUsername(userId, user => {
      userRef = ref.child('users').child(user.uid);
      getSubscriptions();

      // set isBlocked if the current profile user appears in the auth user's blockedUsers list
      if(this.props.store.userAuth.user.blockedUsers) {
        if(user.uid in this.props.store.userAuth.user.blockedUsers) {
          isBlocked = true;
        }
      }

      if(user.uid === this.props.store.userAuth.uid) {
        isMe = true;
        getCollectionCrates(user.uid, () => {
          this.setState({collectionCrateData: collectionCratesList});
        });
      }

      this.setState({user: user, subscriptionData: subscriptionsList, isMe: isMe, isBlocked: isBlocked});

      if(isMe) {
        this.setState({currentTab: ProfileTabs.MY_COLLECTION});
      }

    });
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
  blockButton = (event) => {
    if(this.state.isBlocked) {
      unblockUser(this.state.user.uid, this.props.store.userAuth.uid);
      this.setState({isBlocked: false});
    } else {
      blockUser(this.state.user.uid, this.props.store.userAuth.uid);
      this.setState({isBlocked: true});
    }
  }
  myCollectionTab = (event) => {
    this.setState({currentTab:  ProfileTabs.MY_COLLECTION});
  }
  subscriptionsTab = (event) => {
    this.setState({currentTab:  ProfileTabs.SUBSCRIPTIONS});
  }
  onOpen = (username) => {
    this.props.dispatch(push("/user/" + username));
  }
  render() {
    var emptyState;
    if (this.state.subscriptionData.length == 0) {
      emptyState = <Empty />;
    } else {
      emptyState = '';
    }

    var profileTabContent;
    if(this.state.currentTab == ProfileTabs.SUBSCRIPTIONS) {
      profileTabContent =
      <AbsoluteGrid items={this.state.subscriptionData} displayObject={(<ProfileCrateList onOpen={this.onOpen} />)} responsive={true} itemHeight={100} itemWidth={92} />
      {emptyState};
    } else if(this.state.currentTab == ProfileTabs.MY_COLLECTION) {
      profileTabContent = <CommentList data={this.state.collectionCrateData} />;
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
          {!this.state.isMe ?
          <button style={{marginTop: '40px'}} onClick={this.blockButton}>
          {this.state.isBlocked ? 'Unblock' : 'Block'}
          </button>
          : ''
          }
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
            <h5 style={this.state.currentTab == ProfileTabs.MY_COLLECTION ? styles.activeTab : styles.inactiveTab} onClick={this.myCollectionTab}><span style={{cursor: 'pointer'}}>My Collection</span></h5>
            {this.state.isMe}
          </div>
          : ''
          }
          <div className="Grid-cell">
            <h5 style={this.state.currentTab == ProfileTabs.SUBSCRIPTIONS ? styles.activeTab : styles.inactiveTab} onClick={this.subscriptionsTab}><span style={{cursor: 'pointer'}}>Subscriptions</span></h5>
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

function blockUser(blockUserUid, authUid) {
  userRef = ref.child('users').child(authUid);
  userRef.child("blockedUsers").update({[blockUserUid]: true});
}

function unblockUser(unblockUserUid, authUid) {
  userRef = ref.child('users').child(authUid);
  userRef.child("blockedUsers").update({[unblockUserUid]: null});
}

function getCollectionCrates(uid, callback) {
  var collectionCratesRef = ref.child('collection').child(ref.getAuth().uid);
  collectionCratesRef.orderByChild("openedAt").on("child_added", function(snapshot) {
    var crate = snapshot.val();
    crate.id = snapshot.key();
    collectionCratesList.push(crate);
    collectionCratesList.reverse();
    callback();
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
