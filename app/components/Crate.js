import React from 'react';
import classNames from 'classnames';

var Crate = React.createClass({
  getInitialState: function() {
    return {
      isPressed: false
    }
  },
  pressCrate: function() {
    this.setState({isPressed: true})
  },
  crateClick: function(event) {
    console.log("opened crate: " + this.props.id);
    openCrate(this.props.id);
  },
  render: function() {
    var crateTop = classNames({
      'crate-top': !this.state.isPressed,
      'crate-top-pressed': this.state.isPressed,
    });
    var crateBottom = classNames({
      'crate-bottom': !this.state.isPressed,
      'crate-bottom-pressed': this.state.isPressed,
    });
    var crateShadow = classNames({
      'crate-shadow': !this.state.isPressed,
      'crate-shadow-pressed': this.state.isPressed,
    });
console.log(this.state.isPressed);
    return (
      <div>
        <div className="crate-holder" onClick={this.crateClick} onMouseDown={this.pressCrate}>
          <div className={crateTop}></div>
          <div className={crateBottom}></div>
          <div className={crateShadow}></div>
        </div>
      </div>
    );
  }
});


function openCrate(crateId) {
  var FIREBASE_URL = "https://crackling-fire-5975.firebaseio.com";
  var crate = new Firebase(FIREBASE_URL + "/crates/" + crateId);
  crate.update({
    "opened": true
  });
}

module.exports = Crate;
