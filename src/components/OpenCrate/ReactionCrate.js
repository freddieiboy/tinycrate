import React, { Component } from 'react';
import { RegiftIcon, AirplaneIcon } from '../NewCrates/Icons';
import Hammer from 'react-hammerjs';

class ReactionCrate extends Component {
  constructor() {
    super();
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
      sendIcon: {
        // transform: 'translate(-50%, 0)'
        opacity: '.4'
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
          <div className="Grid-cell full-height relative">
            <Hammer onTap={this.toggleReaction}>
              <div className="Grid Grid--center-content absolute-container">
                <RegiftIcon color={'#E81D1D'} />
              </div>
            </Hammer>
          </div>
        }
      </div>
    )
  }
}

export default ReactionCrate;
