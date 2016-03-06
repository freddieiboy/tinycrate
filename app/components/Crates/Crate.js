import React from 'react';
import { DefaultCrate, PressedCrate, popAnimation } from './CrateUtils';
import $ from 'jquery';

var Crate = React.createClass({
  getInitialState: function() {
    return {
      isPressed: false,
      popping: false
    }
  },
  pressCrate: function() {
    this.setState({isPressed: true, testText: true})
    stopPropagation()
  },
  unpressCrate: function() {
    this.setState({isPressed: false, testText: false})
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
  },
  render: function() {
    /*
      Freddie: onClick also fires on mobile so the explosion animation fires twice.
      MouseUp is also lost outside of element on desktop.
      This is why there is currently no onClick.
    */
    console.log(this.state.testText)

    var crateState;
    if (this.state.isPressed) {
      crateState = <PressedCrate popping={this.state.popping} color={this.props.color} />
    } else {
      crateState = <DefaultCrate color={this.props.color}/>
    }

    $('.crate-holder').click(function(event){
        event.stopPropagation();
    });

    return (
      <div>
        <div className="crate-holder animated bounce" ref="thisCrate"
          onMouseDown={this.pressCrate}
          onMouseUp={this.deleteObj}
          onTouchStart={this.pressCrate}
          onTouchEnd={this.deleteObj}>
          {crateState}
        </div>
      </div>
    );
  }
});



module.exports = Crate;
