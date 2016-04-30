import firebase from 'firebase';
import * as userAuth from '../../redux/modules/userAuth';

var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

export function registerUser(authData, profileColor, callback) {
  ref.child('users').child(authData.uid).transaction((currentData) => {
    // currentData is null for a new user
    if (currentData === null) {
      return {
        provider: authData.provider,
        name: getName(authData),
        username: getUsername(authData),
        profileColor: profileColor,
        didTutorial: true,
        profileImageURL: getProfileImageURL(authData)
      };
    }
  }, (error, committed, snapshot) => {
    if (error) {
      console.log('Transaction failed abnormally!', error);
      callback(false);
    } else if (!committed) {
      // user already exists
      callback(false);
    } else {
      // user created successfully
      callback(true);
    }
  });
}

export function getName (authData) {
  switch(authData.provider) {
    case 'twitter':
    return authData.twitter.displayName
    case 'facebook':
    return authData.facebook.displayName
  }
}

export function getUsername (authData) {
  switch(authData.provider) {
    case 'twitter':
    return authData.twitter.username
    case 'facebook':
    return authData.facebook.displayName.replace(/ /g,'')
  }
}

export function getProfileImageURL(authData) {
  switch(authData.provider) {
    case 'twitter':
    return authData.twitter.profileImageURL.replace("_normal", "")
    case 'facebook':
    return authData.facebook.profileImageURL
  }
}