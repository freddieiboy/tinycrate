import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
var FIREBASE_URL = "https://crackling-fire-5975.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var authData = ref.getAuth();

const itself = this;


var CreatePage = React.createClass({
  getInitialState: function() {
    return {
      text: ''
    }
  },
  showHome: function(event) {
    browserHistory.push("/");
  },
  crateText: function(e) {
    if (e.which == 13) {
      var text = e.target.value;
      this.sendCrate(text)
    }
  },
  sendCrate: function(text) {
    var postsRef = ref.child("crates");
    var newPostRef = postsRef.push();
    var user = ref.getAuth();
    var userRef = ref.child('users').child(user.uid);

    userRef.once('value', function (snap) {
      var user = snap.val();
      if (!user) {
        return;
      }
      newPostRef.set({
        authorUId: authData.uid,
        authorDisplayName: user.name,
        authorProfileImageURL: user.profileImageURL,
        text: text,
        opened: false
      });
    });
  },
  render: function() {
    return (
      <div>
        <div className="homeHeader">
          <p style={{color: 'white', float: 'right', paddingTop: '10px', paddingBottom: '10px', paddingRight: '15px'}} onClick={this.showHome}>Go Back</p>
        </div>
        <div className="container-fluid body-content-create">
          <div>To: name</div>
        </div>
        <footer>
          <input type="text" id="crateText" defaultValue={this.state.text} placeholder='what the crate...' style={{color: 'white'}} onKeyUp={this.crateText}/>
        </footer>
      </div>
    );
  }
});

module.exports = CreatePage;
