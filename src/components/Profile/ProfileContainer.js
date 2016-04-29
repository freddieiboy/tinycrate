import React, {Component} from 'react';
import ProfileView from './ProfileView';
import {bindActionCreators, store, getState} from 'redux';
import {push} from 'react-router-redux';
import { connect } from 'react-redux';
import * as userAuth from '../../redux/modules/userAuth';
import * as newCrates from '../../redux/modules/NewCrates';
import { Router, Route, Link, browserHistory } from 'react-router';
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

class ProfileContainer extends Component {
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
    this.props.actions.showActionBar();
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
    return (
      <div className="ProfileContainer" style={{height: '100%'}}>
        <ProfileView
          showInventory={() => console.log('showInventory')}
          user={this.state.user}
          onOpen={this.onOpen}
          profileButton={this.profileButton}
          isMe={this.state.isMe}
          blockButton={this.blockButton}
          isBlocked={this.state.isBlocked}
          currentTab={this.state.currentTab}
          ProfileTabs={ProfileTabs}
          myCollectionTab={this.myCollectionTab}
          subscriptionsTab={this.subscriptionsTab}
          subscriptionData={this.state.subscriptionData}
          collectionCrateData={this.state.collectionCrateData}
          />
      </div>
    )
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

const mapStateToProps = (state) => ({
  store: {
  userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, userAuth, newCrates), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)
