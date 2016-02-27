var FIREBASE_URL = "https://crackling-fire-5975.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var authData = ref.getAuth();
var unopenedCratesList = [];
var openedCratesList = [];

var data = [
  {id: 1, name: "Mary White", text: "Gifted you 1 Lyft Ride.", image: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"},
  {id: 2, name: "TechCrunch", text: "Digg CEO Gary Liu on the Rebirth of Digg and the Evolution of Content and...", image: "https://pbs.twimg.com/profile_images/615392662233808896/EtxjSSKk.jpg"},
  {id: 3, name: "DJ Khaled", text: "Major 🔑🔑🔑 Alert!!", image: "http://imc.ulximg.com/image/src/artist/1392850906_2f16e083616376c167fda25befb0472c.jpg/40b5f63611a9262fc955282ec0ec47f7/1392850906_dj_khaled_27.jpg"}
];

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

var InventoryPage = React.createClass({
  handleClick: function(event) {
    ref.unauth();
  },
  showHome: function(event) {
    renderHome();
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
      
      <div>
      <header>
      <div style={{color: 'white'}}><img className="user-avatar" src={user.profileImageURL}/>{user.name}</div>
      </header>
      <div className="container-fluid body-content">
      <CommentList data={openedCratesList} />
      </div>
      <footer>
      <p style={{color: 'white', float: 'right', paddingTop: '10px', paddingBottom: '10px', paddingRight: '15px'}} onClick={this.showHome}>Go Back</p>
      </footer>
      </div>
      
      // <div className="Absolute-Center">
      // <img src={user.profileImageURL}/>
      // <p style={{color: 'white'}}>Hello {user.name}!</p>
      // <button onClick={this.handleClick}>Logout</button>
      // </div>
    );
  }
});

var HomePage = React.createClass({
  showInventory: function(event) {
    renderInventory();
  },
  showCreate: function(event) {
    renderCreate();
  },
  render: function() {
    return (
      <div>
      <div className="homeHeader">
      <div style={{color: 'white'}} onClick={this.showInventory}>TinyCrate</div>
      </div>
      <div className="container-fluid body-content-home">
      <CrateList data={unopenedCratesList} />
      
      </div>
      <footer>
      <p style={{color: 'white', float: 'right', paddingTop: '10px', paddingBottom: '10px', paddingRight: '15px'}} onClick={this.showCreate}>New Crate</p>
      </footer>
      </div>
    );
  }
});

var CreatePage = React.createClass({
  showHome: function(event) {
    renderHome();
  },
  componentDidMount: function() {
    $('#crateText').keypress(function (e) {
          if (e.keyCode == 13) {
            var text = $('#crateText').val();
            sendCrate(text);
            $('#crateText').val('');
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
      <div>
      To: name
      </div>
      
      </div>
      <footer>
      <input type="text" id="crateText" placeholder='what the crate...' style={{color: 'white'}}/>
      </footer>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment name={comment.authorDisplayName} key={comment.id} image={comment.authorProfileImageURL}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList" style={{padding: '15px'}}>
        {commentNodes}
      </div>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
      <img src={this.props.image} className="inventoryFeedAvatar"/> {this.props.name}
        <p className="commentAuthor">
          {this.props.children}
        </p>
        
      </div>
    );
  }
});

var CrateList = React.createClass({
  render: function() {
    var crateNodes = this.props.data.map(function(crate) {
      return (
        <Crate name={crate.crate} id={crate.id}>
        </Crate>
      );
    });
    return (
      <div className="crateList" style={{padding: '15px'}}>
        {crateNodes}
      </div>
    );
  }
});

var Crate = React.createClass({
  openCrate: function(event) {
    console.log("opened crate: " + this.props.id);
    openCrate(this.props.id);
  },
  render: function() {
    return (
      <div>
      <img src={'img/crate.png'} className="crate" onClick={this.openCrate}/>
      {this.props.id}
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
    // renderInventory();
    // renderHome();
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

function renderInventory() {
  ReactDOM.render(
    <InventoryPage />,
    document.getElementById('content')
  );
}

function renderHome() {
  ReactDOM.render(
    <HomePage />,
    document.getElementById('content')
  );
}

function renderCreate() {
  ReactDOM.render(
    <CreatePage />,
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

getUnopenedCrates();
getOpenedCrates();
if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
  // renderInventory();
  // renderHome();
} else {
  console.log("User is logged out");
  renderLogin();
}

function sendCrate(text) {
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
}

function openCrate(crateId) {
  var crate = new Firebase(FIREBASE_URL + "/crates/" + crateId);
  crate.update({
    "opened": true
  });
}

function getUnopenedCrates() {
  var unopenedCrates = new Firebase(FIREBASE_URL + "/crates");
  unopenedCratesList = [];
  unopenedCrates.orderByChild("opened").equalTo(false).on("child_added", function(snapshot) {
    console.log(snapshot.val());
    unopenedCratesList.push({id: snapshot.key(), crate: snapshot.val()});
      renderHome();
  });
        renderHome();
}

function getOpenedCrates() {
  var openedCrates = new Firebase(FIREBASE_URL + "/crates");
  openedCratesList = [];
  openedCrates.orderByChild("opened").equalTo(true).on("child_added", function(snapshot) {
    console.log(snapshot.val());
    openedCratesList.push(snapshot.val());
      // renderHome();
  });
}

