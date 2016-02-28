import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import Autocomplete from 'react-autocomplete';
import { Notification } from 'react-notification';
import $ from 'jquery';
import FilePicker from 'component-file-picker';


var FIREBASE_URL = "https://crackling-fire-5975.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var authData = ref.getAuth();

const itself = this;


var CreatePage = React.createClass({
  getInitialState: function() {
    return {
      text: '',
      image: '',
      users: [],
      showNotification: false
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
  sendCrate: function(text) {
    var itself = this;
    var postsRef = ref.child("crates");
    var newPostRef = postsRef.push();
    var user = ref.getAuth();
    var userRef = ref.child('users').child(user.uid);

    var username = $('input[role="combobox"]').val();
    var recipientUser = this.state.users.filter(function(elem) {
      return elem.username === username;
    }).pop();

    userRef.once('value', function (snap) {
      var user = snap.val();
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
          authorProfileImageURL: user.profileImageURL,
          text: text,
          opened: false,
          createdAt: Firebase.ServerValue.TIMESTAMP
        });
        itself.showHome();
      }
    });
  },
  render: function() {
    return (
      <div>
        <div className="homeHeader clearfix" onClick={this.showHome}>
          <img className="downArrow" src="http://i.imgur.com/cWmUR9n.png" style={{float: 'right', margin: '4px 12px'}}></img>
          <p style={{color: 'white', float: 'right', paddingTop: '4px', paddingBottom: '10px', paddingRight: '15px'}} >Go Back</p>
        </div>

        <div className="container-fluid body-content-create">
          <form className="toForm">
            <fieldset>
              <label className="labelInput">To: name</label>
              <Autocomplete
              initialValue=""
              style={{ display: 'block '}}
              items={this.state.users}
              getItemValue={(item) => item.username}
              renderItem={(item, isHighlighted) => (
                <div
                style={isHighlighted ? styles.highlightedItem : styles.item}
                key={item.name}
                id={item.name}
                >{item.username}</div>
              )}
              />
            </fieldset>
          </form>
          <div className="outerEmpty createContainerImg">
            <div className="innerEmpty">
              <img src="http://i.imgur.com/mfbK1EY.png" alt="" className="emptystate"/>
            </div>
          </div>
        </div>

        <footer className="footerCreate">
          <div className="container" style={{paddingTop: '10px'}}>
            <div className="row" style={{paddingBottom: '15px'}}>
              <button style={{position: 'absolute'}} onClick={this.selectFile}>select image</button>
              <img id="imagePreview" src={'http://www-cdr.stanford.edu/~petrie/blank.gif'} style={{width: '32px', height: '32px', marginLeft: '160px'}} />
            </div>
            <div>
              <input id="message" placeholder='crate message...' className="inputSend" style={{width: '65%'}} onKeyUp={this.handleSendCrateKeyboard}></input>
              <button style={{marginLeft: '15px', float: 'right'}} onClick={this.handleSendCrateClick}>send</button>
            </div>
          </div>
        </footer>
        <Notification
        isActive={this.state.showNotification}
        message={"Your crate has been sent!"}
        dismissAfter={2000}
        style={this.getNotificationStyles()}
        />
      </div>
    );
  }
});

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

module.exports = CreatePage;
