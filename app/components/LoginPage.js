import React from 'react';

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
      <img src="./img/sign-in-with-twitter-gray.png" onClick={this.twitterLogin}></img>
      <img src="./img/facebook-login-button.png" style={{width: '158px'}} onClick={this.facebookLogin}></img>
      </div>
    );
  }
});

module.exports = LoginPage;
