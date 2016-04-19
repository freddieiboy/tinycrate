import React, { Component, PropTypes } from 'react';
import { DefaultCrate, PressedCrate, pop1, pop2, openCrate } from './CrateUtils';
import $ from 'jquery';

var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

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
    var crate = ref.child('crateFeed').child(ref.getAuth().uid).child(this.props.id);
    this.setState({popping: true})
    if (this.state.popping == false) {
      pop1(this.refs.thisCrate, this.props.color);
      openCrate(crate, () => {
        setTimeout(() => {
          this.setState({popping: false})
          this.setState({isPressed: false})
          this.props.onDelete(this.props.id);
        }, 700);
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

export default Crate;
