import React from 'react';
import {Emojis} from './Emojis';
import {DefaultCrate, PressedCrate, pop1, pop2} from './Crates/CrateUtils';
import $ from 'jquery';
import Hammer from 'react-hammerjs';

var Empty = React.createClass({
  getInitialState: function() {
    return {
      emoji: 0,
      isPressed: false
    }
  },
  pressCrate: function() {
    this.setState({isPressed: true});
  },
  pickRandomEmoji: function() {
    var random = Math.floor(Math.random()*Emojis.length)
    pop2(this.refs.thisEmptyCrate, 'emptyAlt', this.refs.thisEmptyEmoji);
    this.setState({emoji: random, isPressed: false});
  },
  render: function() {
    var emoji;
    this.state.isPressed ? emoji = 'emojiPressed noTouch' : emoji = 'noTouch'
    return(
      <div style={{height: '100%', position: 'relative'}}>
        <div className="emptyCrate" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <div className={emoji} id="emoji" style={styles.emoji} ref="thisEmptyEmoji">
            {Emojis[this.state.emoji]}
          </div>
          <div style={styles.crateSize}
            onMouseDown={this.pressCrate}
            onTouchStart={this.pressCrate}
            onMouseUp={this.pickRandomEmoji}
            onTouchEnd={this.pickRandomEmoji}>
            <div className="noTouch">
              { this.state.isPressed ? (
                <PressedCrate color={'empty'} />
              ) : (
                <DefaultCrate color={'empty'}/>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Empty;

const styles = {
  crateSize: {
    width: 80,
  },
  emoji: {
    top: '33%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 40,
    width: 40,
    padding: '4',
    borderRadius: '50%',
    position: 'absolute'
  }
}
