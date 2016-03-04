import React from 'react';
import { DefaultCrate, PressedCrate, popAnimation } from './CrateUtils';
// import classNames from 'classnames';
// import Tappable from 'react-tappable';
import NativeListener from 'react-native-listener';

var Crate = React.createClass({
  getInitialState: function() {
    return {
      isPressed: false,
      popping: false
    }
  },
  pressCrate: function() {
    return this.setState({isPressed: true})
  },
  unpressCrate: function() {
    return this.setState({isPressed: false})
  },
  testComment: function() {
    return console.log('testing comment')
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
    console.log(this.state.isPressed)

    var crateState;
    if (this.state.isPressed) {
      crateState = <PressedCrate popping={this.state.popping} color={this.props.color} />
    } else {
      crateState = <DefaultCrate color={this.props.color}/>
    }

    // return (
    //   <Tappable onTap={this.testComment} classBase="pressed" component="div">
    //     <div className="crate-holder animated bounce" ref="thisCrate">
    //       {crateState}
    //     </div>
    //   </Tappable>
    // );

    return (
      <NativeListener
        onMouseDown={this.pressCrate}
        onMouseUp={this.unpressCrate}
        onTouchStart={this.pressCrate}
        onTouchEnd={this.uhpressCrate}>
        <div className="crate-holder animated bounce" ref="thisCrate">
          {crateState}
        </div>
      </NativeListener>
    );
  }
});



module.exports = Crate;
