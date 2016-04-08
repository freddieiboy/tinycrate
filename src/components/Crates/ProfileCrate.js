import React, {Component} from 'react';
import {Emojis} from '../Emojis';
import {DefaultCrate, PressedCrate, pop1, pop2} from './CrateUtils';
import $ from 'jquery';
import Hammer from 'react-hammerjs';

class ProfileCrate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emoji: 13,
      isPressed: false
    }
  }
  pressCrate = () => {
    this.setState({isPressed: true});
  }
  openCrate = () => {
    pop2(this.refs.thisProfileCrate, 'emptyAlt', this.refs.thisProfileEmoji);
    this.setState({isPressed: false});
    this.props.onOpen(this.props.username);
  }
  render() {
    var emoji;
    this.state.isPressed ? emoji = 'emojiPressed noTouch' : emoji = 'noTouch'
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
        padding: '4px',
        borderRadius: '50%',
        position: 'absolute'
      }
    }
    return(
      <div style={{height: '100%', position: 'relative'}}>
        <div className="emptyCrate" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <div className={emoji} id="emoji" style={styles.emoji} ref="thisProfileEmoji">
            <img className="user-avatar" src={this.props.profileImageURL}/>
            {Emojis[this.state.emoji]}
          </div>
          <div style={styles.crateSize}
            ref="thisProfileCrate"
            onMouseDown={this.pressCrate}
            onTouchStart={this.pressCrate}
            onMouseUp={this.openCrate}
            onTouchEnd={this.openCrate}>
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
}

export default ProfileCrate;
