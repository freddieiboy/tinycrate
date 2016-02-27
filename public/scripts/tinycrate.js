var ref = new Firebase("https://crackling-fire-5975.firebaseio.com");
var authData = ref.getAuth();

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

var LogoutPage = React.createClass({
  handleClick: function(event) {
    ref.unauth();
  },
  render: function() {
    var user = ref.getAuth();
    var userRef;
    userRef = ref.child('users').child(user.uid);
    userRef.once('value', function (snap) {
      user = snap.val();
      if (!user) {
        return;
      }
    });
    return (
      <div className="Absolute-Center">
      <img src={user.profileImageURL}/>
      <p style={{color: 'white'}}>Hello {user.name}!</p>
      <button onClick={this.handleClick}>Logout</button>
      </div>
    );
  }
});

ref.onAuth(function(authData) {
  if (authData) {
    ref.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData),
      profileImageURL: getProfileImageURL(authData)
    });
    renderLogout();
  } else {
    renderLogin();
  }
});

function renderLogin() {
  ReactDOM.render(
    <LoginPage />,
    document.getElementById('content')
  );
}

function renderLogout() {
  ReactDOM.render(
    <LogoutPage />,
    document.getElementById('content')
  );
}

function getName(authData) {
  switch(authData.provider) {
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
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

if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
  renderLogout();
} else {
  console.log("User is logged out");
  renderLogin();
}