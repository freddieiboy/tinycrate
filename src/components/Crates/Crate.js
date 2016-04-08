import React, { Component, PropTypes } from 'react';
import { DefaultCrate, PressedCrate, pop1, pop2 } from './CrateUtils';
import $ from 'jquery';

var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var user = ref.getAuth();
// var userRef = ref.child('users').child(user.uid);

class Crate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPressed: false,
      popping: false
    }
  }
  pressCrate = (event) => {
    this.setState({isPressed: true, testText: true})
    event.preventDefault();
  }
  deleteObj = (event) => {
    console.log("create delete");
    var crate = ref.child('crates').child(this.props.id);
    this.setState({popping: true})
    if (this.state.popping == false) {
      pop1(this.refs.thisCrate, this.props.color);
      crate.update({
        "opened": true
      }, function(error) {
        if (error) {
          console.log("Data could not be saved." + error);
        } else {
          console.log("Data saved successfully.");

          // increment 'unwrappedCount' after opening a crate
          // incrementUnwrappedCount();

          setTimeout(() => {
            this.setState({popping: false})
            this.setState({isPressed: false})
            this.props.onDelete(this.props.id);
          }, 700);
        }
      });
    }
    event.preventDefault();
  }
  render() {
    return (
      <div>
        <div className="crate-holder animated bounce" ref="thisCrate"
          onMouseDown={this.pressCrate}
          onMouseUp={this.deleteObj}
          onTouchStart={this.pressCrate}
          onTouchEnd={this.deleteObj}>
          <div className="noTouch">
            { this.state.isPressed ? (
              <PressedCrate popping={this.state.popping} color={this.props.color} />
            ) : (
              <DefaultCrate color={this.props.color}/>
            )}
          </div>
        </div>
      </div>
    );
  }
}

//TODO: redo this with Alec!
// const incrementUnwrappedCount = () => {
//   userRef.child("unwrappedCount").transaction(unwrappedCount => {
//     if(unwrappedCount === null) {
//       return 1;
//     }
//     return unwrappedCount + 1;
//   });
// }

export default Crate;
