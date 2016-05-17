import React, { Component } from 'react';
import { RegiftIcon, AirplaneIcon, ReactionIcon, CancelIcon } from '../NewCrates/Icons';
import Hammer from 'react-hammerjs';
import $ from 'jquery';
import { ifStyle } from '../utilities';
import ReactionEmojis from './ReactionEmojis';
import * as crates from '../../redux/modules/crates';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sendNotificationCrate } from '../Crates/CrateUtils';

class ReactionCrateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      emojis: []
    }
  }
  componentDidMount = () => {
    this.shuffleEmojis();
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    const isOpened = nextState.isOpened !== this.state.isOpened;
    const localEmojis = nextState.emojis !== this.state.emojis;
    const setReactionEmoji = nextProps.store.emoji !== this.props.store.emoji;
    const thisPropsColor = nextProps.color !== this.props.color;

    return isOpened || localEmojis || setReactionEmoji || thisPropsColor
  }
  componentDidUpdate = () => {
    console.log('list did update')
  }
  toggleReaction = () => {
    if (this.state.isOpened) {
      if (this.props.store.emoji.length > 0) {
        this.sendReaction();
        notie.alert(4, 'You reacted with a ' + this.props.store.emoji + '  !', 2);
        this.props.actions.setReactionEmoji('');
      }
      this.setState({isOpened: false})
    } else {
      this.setState({isOpened: true})
    }
  }
  shuffleEmojis = () => {
    const emojis = ['💛', '😱', '💩', '😰', '⬛️', '⬜️', '🍔', '🐈']
    let emojiArray = []
    for (var i = 0; i < 4;) {
      const randomEmoji = emojis[Math.floor(Math.random()*emojis.length)];
      if (emojiArray.indexOf(randomEmoji) < 0) {
        emojiArray.push(randomEmoji)
        i++
      }
    }
    this.setState({ emojis: emojiArray })
    this.props.actions.setReactionEmoji('');
  }
  sendReaction = () => {
    const reactionText = this.props.store.user.username + "'s reaction to your crate: " + this.props.store.emoji;
    const crate = this.props.openedCrate;
    sendNotificationCrate(this.props.store, crate.authorUId, reactionText, crate.crateColor, "reactions", crate);
  }
  render() {
    const styles = {
      ReactionCrateList: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      emojiPicker: {
        height: '18em',
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
      },
      reload: {
        // borderBottom: '.1em dashed' + this.props.color,
      },
      newEmojis: {
        transform: 'scale(.7)'
      }
    }
    const emojis = this.state.emojis.map((emoji, key) => {
      return (
        <ReactionEmojis key={key} emoji={emoji} color={this.props.color} />
      )
    })
    const selectedEmoji = this.props.store.emoji.length > 0 ? this.props.color : '#fff'

    console.log(this.props.openedCrate)

    return (
      <div className="ReactionCrateList Grid full-container" style={styles.ReactionCrateList}>
        {this.state.isOpened ?
          <div className="full-container animated-fast fadeIn">
            <div className="Grid-cell">
              <div className="emojiPicker Grid Grid--columns absolute" style={styles.emojiPicker}>

                <div className="reload Grid-cell relative" style={styles.reload} onTouchEnd={this.shuffleEmojis}>
                  <div className="Grid Grid--center-content absolute-container">
                    <div className="newEmojis relative" style={styles.newEmojis}>
                      <RegiftIcon color={this.props.color} />
                    </div>
                  </div>
                </div>
                {emojis}
              </div>
            </div>
            <div className="Grid-cell full-container relative"
              style={ifStyle(
                styles.sendIcon,
                this.props.store.emoji.length > 0 && styles.sendIconReady
              )}>
              <Hammer onTap={this.toggleReaction}>
                <div className="Grid Grid--center-content absolute-container">
                  {this.props.store.emoji.length > 0 ?
                    <AirplaneIcon color={selectedEmoji} />
                    :
                    <CancelIcon color={'#fff'} />
                  }
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

const mapStateToProps = (state) => ({
  store: {
    emoji: state.crates.reactionEmoji,
    user: state.userAuth.user,
    userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(crates, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ReactionCrateList)
