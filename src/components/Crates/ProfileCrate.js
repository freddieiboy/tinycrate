import React, {Component} from 'react';
import {EmojiContainer} from '../Emojis';
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
    //TODO: implement generic method/callback which returns correct data when crate is opened
    // For now, the crate will only have the username prop if it spawns from the ProfilePage
    if(this.props.username) {
      this.props.onOpen(this.props.username);
    } else {
      this.props.onOpen(this.props.id);
    }
  }
  render() {
    //TODO: use crateTemplate in here.

    var emoji;
    var color = 'empty';
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
    if(this.props.color) {
      color = this.props.color;
    }
    return(
      <div style={{height: '100%', position: 'relative'}}>
        <div className="emptyCrate" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <div className={emoji} id="emoji" style={styles.emoji} ref="thisProfileEmoji">
            <img className="user-avatar" src={this.props.profileImageURL}/>
            {EmojiContainer[this.state.emoji]}
          </div>
          <div style={styles.crateSize}
            ref="thisProfileCrate"
            onMouseDown={this.pressCrate}
            onTouchStart={this.pressCrate}
            onMouseUp={this.openCrate}
            onTouchEnd={this.openCrate}>
            <div className="noTouch">
              { this.state.isPressed ? (
                <PressedCrate color={color} />
              ) : (
                <DefaultCrate color={color}/>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileCrate;
