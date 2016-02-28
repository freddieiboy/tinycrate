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
  deleteObj: function(event) {
    var itself = this;
    console.log("create delete");
    var FIREBASE_URL = "https://crackling-fire-5975.firebaseio.com";
    var crate = new Firebase(FIREBASE_URL + "/crates/" + this.props.id);
    crate.update({
      "opened": true
    }, function(error) {
      if (error) {
        console.log("Data could not be saved." + error);
      } else {
        console.log("Data saved successfully.");
        itself.props.onDelete(itself.props.id);
      }
    });
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
        <div className="crate-holder" onClick={this.deleteObj} onMouseDown={this.pressCrate}>
          <div className={crateTop}></div>
          <div className={crateBottom}></div>
          <div className={crateShadow}></div>
        </div>
      </div>
    );
  }
});



module.exports = Crate;
