import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import Autocomplete from 'react-autocomplete';
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
      users: []
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
  crateText: function(e) {
    if (e.which == 13) {
      var text = e.target.value;
      this.sendCrate(text)
    }
  },
  selectFile: function() {
    FilePicker({ accept: [ 'image/*'] }, function(files){
      var reader = new FileReader();
      var file = files[0];
      reader.onload = function(upload) {
        // base64 string of image
        console.log(upload.target.result);
      }
      reader.readAsDataURL(file);
    });
  },
  sendCrate: function(text) {
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
          opened: false
        });
      } else {
        newPostRef.set({
          authorUId: authData.uid,
          authorDisplayName: user.name,
          public: true,
          authorProfileImageURL: user.profileImageURL,
          text: text,
          opened: false
        });
      }
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
          <Autocomplete
          initialValue=""
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
        </div>
        <footer>
        <div className="container" style={{paddingTop: '10px'}}>
          <div className="row">
            <button onClick={this.selectFile}>select image</button>
          </div>
          <div className="row">
          <input type="text" id="crateText" defaultValue={this.state.text} placeholder='what the crate...' style={{color: 'white'}} onKeyUp={this.crateText}/>
          </div>
        </div>
        </footer>
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
