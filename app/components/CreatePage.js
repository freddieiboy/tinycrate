import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import Autocomplete from 'react-autocomplete';
import { Notification } from 'react-notification';
import $ from 'jquery';
import FilePicker from 'component-file-picker';
import ActionBar from './ActionBar';
import Hammer from 'react-hammerjs';
import {Motion, spring} from 'react-motion';
import CrateTemplate from './Crates/CrateTemplate';
import {Emojis} from './Emojis';

var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var authData = ref.getAuth();
var userRef = ref.child('users').child(authData.uid);
var user;

const itself = this;

var CreatePage = React.createClass({
  getInitialState: function() {
    return {
      text: '',
      image: '',
      users: [],
      showNotification: false,
      isOpened: false
    }
  },
  componentDidMount: function() {
    var itself = this;
    var ref = new Firebase(FIREBASE_URL + "/users");
    var twitterUsers = [];
    ref.orderByChild("username").on("child_added", function(snapshot) {
      if(snapshot.val().username !== undefined) {
        twitterUsers.push({uid: snapshot.key(), name: snapshot.val().name, username: snapshot.val().username});
      }
      itself.setState({users: twitterUsers});
    });

    this.setState({isOpened: true});
  },
  componentWillUnmount: function() {
    this.setState({isOpened: false});
  },
  showHome: function(event) {
    browserHistory.push("/");
  },
  handleSendCrateKeyboard: function(e) {
    var itself = this;
    var text = e.target.value;
    if (e.which == 13) {
      var text = e.target.value;
      if (text.length > 0) {
        this.setState({showNotification: true});
        setTimeout(function(){
          itself.sendCrate(text);
        }, 2000);
      } else {
        alert("Your message cannot be empty!");
      }
    }
  },
  handleSendCrateClick: function(e) {
    var itself = this;
    var text = $("#message").val();
    if (text.length > 0) {
      this.setState({showNotification: true});
      setTimeout(function(){
        itself.sendCrate(text);
      }, 2000);
    } else {
      alert("Your message cannot be empty!");
    }
  },
  getNotificationStyles() {
    let bar = {
      background: '#8BC34A'
      // try
    };

    let active = {
      left: '3rem',
      bottom: '12rem'
    };

    return { bar, active };
  },
  selectFile: function() {
    var itself = this;
    FilePicker({ accept: [ 'image/*'] }, function(files){
      var reader = new FileReader();
      var file = files[0];
      reader.onload = function(upload) {
        // base64 string of image
        itself.setState({image: upload.target.result});
        $("#imagePreview").attr('src', itself.state.image);
        // console.log(upload.target.result);
      }
      reader.readAsDataURL(file);
    });
  },
  selectRandomNumber: function() {
    function randomColor() {
      var colors = [
        "green",
        "yellow",
        "orange",
        "blue",
        "pink",
        "purple"
      ];
      return colors[Math.floor(Math.random() * 6)];
    }
    return randomColor()
  },
  sendCrate: function(text) {
    var itself = this;
    var postsRef = ref.child("crates");
    var newPostRef = postsRef.push();

    var username = $('input[role="combobox"]').val();
    var recipientUser = this.state.users.filter(function(elem) {
      return elem.username === username;
    }).pop();

    userRef.once('value', function (snap) {
      user = snap.val();
      if (!user) {
        return;
      }
      if(recipientUser) {
        console.log(recipientUser.uid);
        newPostRef.set({
          authorUId: authData.uid,
          authorDisplayName: user.name,
          authorProfileImageURL: user.profileImageURL,
          recipientUId: recipientUser.uid,
          text: text,
          crateColor: itself.selectRandomNumber(),
          image: (itself.state.image == '') ? null : itself.state.image,
          opened: false,
          createdAt: Firebase.ServerValue.TIMESTAMP
        });
        itself.showHome();
      } else {
        newPostRef.set({
          authorUId: authData.uid,
          authorDisplayName: user.name,
          public: true,
          crateColor: itself.selectRandomNumber(),
          authorProfileImageURL: user.profileImageURL,
          text: text,
          opened: false,
          createdAt: Firebase.ServerValue.TIMESTAMP
        });
        itself.showHome();
      }
      // increment 'giftedCount' after gifting a crate
      incrementGiftedCount();
      // update the list of recent giftees which shows on the user's profile
      updateRecentGiftees(recipientUser);
    });
  },
  opacity0: function() {
    return {opacity: spring(0)}
  },
  opacity1: function() {
    return {opacity: spring(1)}
  },
  loaded: function() {
    const isOpened = !this.state.isOpened;
    return Object.assign({}, isOpened && this.opacity0(), !isOpened && this.opacity1())
  },
  render: function() {

    return (
      <div>
        <Motion style={this.loaded()}>
          {({opacity}) =>
            <div style={{opacity: opacity}}>
              <div className="container-fluid body-content-create">
                <CrateTemplate color={'green'} crateSize={80} pop={true}/>
              </div>
            </div>}
        </Motion>
      </div>
    );
  }
});

// TODO:30 this is the old form to find users
// <div className="container-fluid body-content-create">
//   <form className="toForm">
//     <fieldset>
//       <label className="labelInput">To: name</label>
//       <Autocomplete
//       initialValue=""
//       style={{ display: 'block '}}
//       items={this.state.users}
//       getItemValue={(item) => item.username}
//       renderItem={(item, isHighlighted) => (
//         <div
//         style={isHighlighted ? styles.highlightedItem : styles.item}
//         key={item.name}
//         id={item.name}
//         >{item.username}</div>
//       )}
//       />
//     </fieldset>
//   </form>
// </div>

// TODO:20 this is the old footer with the send button
// <footer className="footerCreate">
//   <div className="container" style={{paddingTop: '10px'}}>
//     <div className="row" style={{paddingBottom: '15px'}}>
//       <button style={{position: 'absolute'}} onClick={this.selectFile}>select image</button>
//       <img id="imagePreview" src={'http://www-cdr.stanford.edu/~petrie/blank.gif'} style={{width: '32px', height: '32px', marginLeft: '160px'}} />
//     </div>
//     <div>
//       <input id="message" placeholder='crate message...' className="inputSend" style={{width: '65%'}} onKeyUp={this.handleSendCrateKeyboard}></input>
//       <button style={{marginLeft: '15px', float: 'right'}} onClick={this.handleSendCrateClick}>send</button>
//     </div>
//   </div>
// </footer>

// TODO:0 This the crate holder
// <div className="outerEmpty createContainerImg">
//   <div className="innerEmpty">
//     <img src="http://i.imgur.com/mfbK1EY.png" alt="" className="emptystate"/>
//   </div>
// </div>

// TODO:40 this is the old notification
// <Notification
// isActive={this.state.showNotification}
// message={"Your crate has been sent!"}
// dismissAfter={2000}
// style={this.getNotificationStyles()}
// />

let styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
    padding: '2px 6px',
    cursor: 'default'
  },

  menu: {
    border: 'solid 1px #ccc'
  }
}

function incrementGiftedCount() {
  userRef.child("giftedCount").transaction(function(giftedCount) {
    if(giftedCount === null) {
      return 1;
    }
    return giftedCount + 1;
  });
}

function updateRecentGiftees(giftee) {
  userRef.child("giftees").child(giftee.uid).transaction(function(giftee) {
    return {
      giftedAt: Firebase.ServerValue.TIMESTAMP
    };
  });
}

module.exports = CreatePage;
