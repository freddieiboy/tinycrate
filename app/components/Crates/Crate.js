import React, { Components } from 'react';
import { DefaultCrate, PressedCrate, popAnimation } from './CrateUtils';
import $ from 'jquery';

var Crate = React.createClass({
  getInitialState: function() {
    return {
      isPressed: false,
      popping: false
    }
  },
  pressCrate: function(event) {
    this.setState({isPressed: true, testText: true})
    event.preventDefault();
  },
  deleteObj: function(event) {
    var itself = this;
    console.log("create delete");
    var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
    var crate = new Firebase(FIREBASE_URL + "/crates/" + this.props.id);
    crate.update({
      "opened": true
    }, function(error) {
      if (error) {
        console.log("Data could not be saved." + error);
      } else {
        console.log("Data saved successfully.");
        itself.setState({popping: true})
        popAnimation(itself.refs.thisCrate)

        setTimeout(function() {
          itself.setState({popping: false})
          itself.setState({isPressed: false})
          itself.props.onDelete(itself.props.id);
        }, 700);
      }
    });
    event.preventDefault();
  },
  render: function() {
    var isPressed = this.state.isPressed;
    return (
      <div>
        <div className="crate-holder animated bounce" ref="thisCrate"
          onMouseDown={this.pressCrate}
          onMouseUp={this.deleteObj}
          onTouchStart={this.pressCrate}
          onTouchEnd={this.deleteObj}>
          <div className="noTouch">
            { isPressed ? (
              <PressedCrate popping={this.state.popping} color={this.props.color} />
            ) : (
              <DefaultCrate color={this.props.color}/>
            )}
          </div>
        </div>
      </div>
    );
  }
});



module.exports = Crate;
