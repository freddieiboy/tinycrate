import React, { Component } from 'react';
import { RegiftIcon, AirplaneIcon, ReactionIcon } from '../NewCrates/Icons';
import Hammer from 'react-hammerjs';

class ReactionCrate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false
    }
  }
  toggleReaction = () => {
    if (this.state.isOpened) {
      this.setState({isOpened: false})
    } else {
      this.setState({isOpened: true})
    }
  }
  render() {
    const styles = {
      ReactionCrate: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      emojiPicker: {
        height: '15em',
        width: '4em',
        bottom: '100%',
        left: '50%',
        backgroundColor: '#000',
        borderTopLeftRadius: '1em',
        borderTopRightRadius: '1em',
        transform: 'translate(-50%, 0)'
      },
      emojiPressed: {
        backgroundColor: '#232323'
      },
      sendIcon: {
        // transform: 'translate(-50%, 0)'
        opacity: '.4'
      },
      reactionIcon: {
        transform: 'scale(2.3)'
      }
    }
    return (
      <div className="ReactionCrate Grid full-container" style={styles.ReactionCrate}>
        {this.state.isOpened ?
          <div className="full-container">
            <div className="Grid-cell">
              <div className="emojiPicker Grid Grid--columns absolute" style={styles.emojiPicker}>
                <div className="emoji Grid-cell relative">
                  <div className="Grid Grid--center-content absolute-container">🐞</div>
                </div>
                <div className="emoji Grid-cell relative">
                  <div className="Grid Grid--center-content absolute-container">🍻</div>
                </div>
                <div className="emoji Grid-cell relative">
                  <div className="Grid Grid--center-content absolute-container">😁</div>
                </div>
              </div>
            </div>
            <div className="Grid-cell full-container relative" style={styles.sendIcon}>
              <Hammer onTap={this.toggleReaction}>
                <div className="Grid Grid--center-content absolute-container">
                  <AirplaneIcon color={'#fff'} />
                </div>
              </Hammer>
            </div>
          </div>
        :
          <div className="Grid-cell full-height relative" style={styles.reactionIcon}>
            <Hammer onTap={this.toggleReaction}>
              <div className="Grid Grid--center-content absolute-container">
                <ReactionIcon color={this.props.color} />
              </div>
            </Hammer>
          </div>
        }
      </div>
    )
  }
}

export default ReactionCrate;
