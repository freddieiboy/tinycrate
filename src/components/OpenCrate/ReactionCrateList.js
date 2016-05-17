import React, { Component } from 'react';
import { RegiftIcon, AirplaneIcon, ReactionIcon } from '../NewCrates/Icons';
import Hammer from 'react-hammerjs';
import $ from 'jquery';
import { ifStyle } from '../utilities';
import ReactionEmojis from './ReactionEmojis';

class ReactionCrateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      isSelected: false,
      selectedReaction: ''
    }
  }
  toggleReaction = () => {
    if (this.state.isOpened) {
      this.setState({isOpened: false})
    } else {
      this.setState({isOpened: true})
    }
  }
  selectReaction = (event) => {
    // if (!this.state.isSelected) {
    //   this.setState({
    //     isSelected: true,
    //     selectedReaction: event.target
    //   })
    // }
  }
  render() {
    const styles = {
      ReactionCrateList: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      emojiPicker: {
        height: '15em',
        width: '5em',
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
      sendIconReady: {
        opacity: '1'
      },
      reactionIcon: {
        transform: 'scale(2.3)'
      }
    }
    const types = ['1', '2', '3']
    const emojis = types.map((emoji, key) => {
      return <ReactionEmojis key={key} emoji={emoji} />
    })
    // console.log(this.state.selectedReaction)
    return (
      <div className="ReactionCrateList Grid full-container" style={styles.ReactionCrateList}>
        {this.state.isOpened ?
          <div className="full-container animated-fast fadeIn">
            <div className="Grid-cell">
              <div className="emojiPicker Grid Grid--columns absolute" style={styles.emojiPicker}>
                {emojis}
              </div>
            </div>
            <div className="Grid-cell full-container relative"
              style={ifStyle(
                styles.sendIcon,
                this.state.selectedReaction && styles.sendIconReady
              )}>
              <Hammer onTap={this.toggleReaction}>
                <div className="Grid Grid--center-content absolute-container">
                  <AirplaneIcon color={this.state.selectedReaction ? this.props.color : '#fff'} />
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

export default ReactionCrateList;
