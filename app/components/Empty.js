import React from 'react';
import {Emojis} from './Emojis';
import {DefaultCrate, PressedCrate, pop1, pop2} from './Crates/CrateUtils';
import $ from 'jquery';
import Hammer from 'react-hammerjs';
import CrateTemplate from './Crates/CrateTemplate';

var Empty = React.createClass({
  getInitialState: function() {
    return {
      emoji: 0,
      isPressed: false
    }
  },
  pickRandomEmoji: function() {
    var random = Math.floor(Math.random()*Emojis.length)
    this.setState({emoji: random});
  },
  render: function() {
    return(
      <div className="empty" style={{height: '100%', position: 'relative'}}>
        <div className="emptyCrate" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} onMouseUp={this.pickRandomEmoji}>
          <CrateTemplate color={'empty'} crateSize={80} cratePreview={Emojis[this.state.emoji]} pop={true}/>
        </div>
      </div>
    )
  }
});

module.exports = Empty;
