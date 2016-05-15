import firebase from 'firebase';
import * as userAuth from '../../redux/modules/userAuth';
import $ from 'jquery';

var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

export function registerUser(authData, username, profileColor, callback) {
  ref.child('users').child(authData.uid).transaction((currentData) => {
    // currentData is null for a new user
    if (currentData === null) {
      return {
        provider: authData.provider,
        name: $('#Full-Name').val(),
        username: username,
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
      var usernameRecord = {};
      usernameRecord['usernames/'+ snapshot.val().username] = snapshot.key();
      // map username to uid to allow for username availability checking
      ref.update(usernameRecord, function(error) {
        if(error) {
          console.log(error);
          callback(false);
        } else {
          callback(true);
        }
      });
    }
  });
}

export function updateSettings(newProfileColor, callback) {
  var userRef = ref.child('users').child(ref.getAuth().uid);
  userRef.update({
    "profileColor": newProfileColor,
    "name": $('#Full-Name').val()
  }, (error) => {
    callback(error);
  });
}

export function getProfileColor(callback) {
  ref.child('users').child(ref.getAuth().uid).once('value', (snap) => {
    callback(snap.val().profileColor);
  });
}

export function isUsernameAvailable(username, callback) {
 ref.child('usernames').child(username).once('value', function(snapshot) {
   var isAvailable = (snapshot.val() === null);
   callback(isAvailable);
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
    return authData.data.facebook.displayName.replace(/ /g,'')
  }
}

export function getProfileImageURL(authData) {
  switch(authData.provider) {
    case 'twitter':
    return authData.twitter.profileImageURL.replace("_normal", "")
    case 'facebook':
    return 'http://graph.facebook.com/' + authData.uid.replace('facebook:', '') + '/picture?width=1000&height=1000&type=square'
  }
}
