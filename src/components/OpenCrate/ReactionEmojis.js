import React, { Component } from 'react';
import Hammer from 'react-hammerjs';
import * as crates from '../../redux/modules/crates';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ReactionEmojis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    }
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    const isSelected = nextState.isSelected !== this.state.isSelected;
    const setReactionEmoji = nextProps.store.emoji !== this.props.store.emoji;
    const thisEmoji = nextProps.emoji !== this.props.store.emoji;

    return isSelected || setReactionEmoji || thisEmoji
  }
  setReactionEmoji = () => {
    const {store, actions} = this.props;
    actions.setReactionEmoji(this.props.emoji);

    if (!this.state.isSelected) {
      this.setState({isSelected: true})
    } else {
      this.setState({isSelected: false})
      actions.setReactionEmoji('');
    }
  }
  componentWillUpdate = () => {
    if (this.props.store.emojis !== this.props.emoji && this.state.isSelected) {
      this.setState({isSelected: false})
    }
  }
  render() {
    const styles = {
      ReactionEmojis: {
        opacity: !this.state.isSelected && this.props.store.emoji !== this.props.emoji && this.props.store.emoji.length > 0 ? '.5' : '1'
      },
      emoji: {
        transform: 'scale(1.5)'
      },
      selectedIcon: {
        height: '.3em',
        width: '.3em',
        borderRadius: '50%',
        backgroundColor: this.props.color,
        top: '0.1em',
        right: '-0.6em'
      }
    }
    return (
      <Hammer onTap={this.setReactionEmoji}>
        <div className="ReactionEmojis Grid-cell relative" style={styles.ReactionEmojis}>
          <div className="Grid Grid--center-content absolute-container">
            <div className="innerEmoji relative" style={styles.emoji}>
              {this.state.isSelected ?
                <div className="selectedIcon absolute" style={styles.selectedIcon}></div>
               : null}
              {this.props.emoji}
            </div>
          </div>
        </div>
      </Hammer>
    )
  }
}

const mapStateToProps = (state) => ({
  store: {
    emoji: state.crates.reactionEmoji
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(crates, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ReactionEmojis)
