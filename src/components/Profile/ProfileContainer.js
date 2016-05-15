import React, {Component} from 'react';
import ProfileView from './ProfileView';
import {bindActionCreators, store, getState} from 'redux';
import {routerActions} from 'react-router-redux';
import { connect } from 'react-redux';
import * as userAuth from '../../redux/modules/userAuth';
import * as newCrates from '../../redux/modules/NewCrates';
import { Router, Route, Link, browserHistory } from 'react-router';
import { sendNotificationCrate } from '../Crates/CrateUtils';
import { colors } from '../Crates/CrateTemplate';
import { trackEvent } from '../AnalyticsUtil';
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
      currentTab: null,
      isMe: false,
      isBlocked: false,
      isMounted: false
    }
  }
  componentDidMount = () => {
    if (this.props.store.userAuth.username === 'guest') {
      this.setState({isMounted: false})
      this.props.actions.push('/login');
    } else {
      this.setState({currentTab: ProfileTabs.SUBSCRIPTIONS})
      currentProfileId = this.props.params.userId;
      this.loadProfileForUser(currentProfileId);
      this.props.actions.showActionBar();
      this.setState({isMounted: true})
    }
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    const isBlocked = this.state.isBlocked !== nextState.isBlocked
    const loggedIn = this.props.store.userAuth.currently !== nextProps.store.userAuth.currently;
    const currentData = this.state.user !== nextState.user
    const hasSubData = this.state.subscriptionData !== nextState.subscriptionData;
    const hasColData = this.state.collectionCrateData === nextState.collectionCrateData;
    const tab = this.state.currentTab !== nextState.currentTab
    return loggedIn || currentData || hasSubData || hasColData || tab || isBlocked
  }
  componentWillUpdate = (nextProps) => {
    if (nextProps.store.userAuth.currently === 'ANONYMOUS') {
      console.log("User is logged out");
      this.props.actions.push('/login')
    }
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
      setTimeout(() => {
        trackEvent("Settings Button");
        this.props.actions.push('/settings');
      }, 700)
    } else {
      setTimeout(() => {
        trackEvent("Subscribe Button");
        subscribeToUser(this.props.store, this.state.user, this.props.store.userAuth.uid);
      }, 700)
    }
  }
  blockButton = (event) => {
    if(this.state.isBlocked) {
      trackEvent("Unblock Button");
      unblockUser(this.state.user.uid, this.props.store.userAuth.uid);
      this.setState({isBlocked: false});
      notie.alert(3, this.state.user.name + ' has been blocked!', 2);
    } else {
      trackEvent("Block Button");
      blockUser(this.state.user.uid, this.props.store.userAuth.uid);
      this.setState({isBlocked: true});
      notie.alert(4, this.state.user.name + ' has been unblocked!', 2);
    }
  }
  myCollectionTab = (event) => {
    trackEvent("Collection Tab Button");
    this.setState({currentTab:  ProfileTabs.MY_COLLECTION});
  }
  subscriptionsTab = (event) => {
    trackEvent("Subscriptions Tab Button");
    this.setState({currentTab:  ProfileTabs.SUBSCRIPTIONS});
  }
  onOpen = (username) => {
    this.props.actions.push("/user/" + username);
  }
  logout = () => {
    setTimeout(() => {
      trackEvent("Logout Button");
      this.props.actions.logoutUser();
    }, 700)
  }
  close = () => {
    this.props.actions.push('/');
  }
  render() {
    // let userColor;
    // this.props.store.userAuth.user === null ? userColor = 'empty' : userColor = colors(this.props.store.userAuth.user.profileColor)

    // let userColor;
    // if (this.state.profileColor === null) {
    //   userColor = colors('empty')
    // } else {
    //   userColor = colors(this.state.profileColor)
    // }
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
          logout={this.logout}
          close={this.close}
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

function subscribeToUser(store, user, authUid) {
  userRef = ref.child('users').child(authUid);
  userRef.child("subscriptions").child(user.username).transaction(function(user) {
    return {
      subscribedAt: Firebase.ServerValue.TIMESTAMP
    };
  }, function(error, committed, snapshot) {
    if (error) {
      console.log('Transaction failed abnormally!', error);
    } else if (!committed) {
      console.log('Transaction not committed!');
    } else {
      notie.alert(1, 'You are now subscribed to ' + user.username + "!", 2);
      var notificationCrateText = store.userAuth.username + ' has subscribed to your crates.';
      sendNotificationCrate(store, user.uid, notificationCrateText, 'green');
    }
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
  actions: bindActionCreators(Object.assign({}, userAuth, newCrates, routerActions), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)
