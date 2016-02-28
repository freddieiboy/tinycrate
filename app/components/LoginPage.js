import React from 'react';
import firebase from 'firebase';
import { Router, Route, Link, browserHistory } from 'react-router';
var FIREBASE_URL = "https://crackling-fire-5975.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

var LoginPage = React.createClass({
  twitterLogin: function(event) {
    ref.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  },
  facebookLogin: function(event) {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  },
  render: function() {
    return (
      <div className="Absolute-Center">
      <p style={{color: 'white', fontSize: '25px'}}>📦 TinyCrate 📦</p>
      <div></div>
      <button onClick={this.twitterLogin} onTouch={this.twitterLogin}>Twitter Login</button>
      <button onClick={this.facebookLogin}>Facebook Login</button>
      </div>
    );
  }
});

ref.onAuth(function(authData) {
  if (authData) {
    ref.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData),
      username: getUsername(authData),
      profileImageURL: getProfileImageURL(authData)
    });
    browserHistory.push("/");
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

function getUsername(authData) {
  switch(authData.provider) {
    case 'twitter':
    return authData.twitter.username;
    case 'facebook':
    return null;
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

module.exports = LoginPage;
