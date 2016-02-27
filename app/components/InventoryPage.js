import React from 'react';

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

module.exports = InventoryPage;
