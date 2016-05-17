import React, { Component } from 'react';
import Hammer from 'react-hammerjs';
import * as crates from '../../redux/modules/crates';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ReactionEmojis extends Component {
  setReactionEmoji = () => {
    const {store, actions} = this.props;
    actions.setReactionEmoji(this.props.emoji);
  }
  render() {
    const styles = {
      ReactionEmojis: {

      },
      emoji: {
        transform: 'scale(1.5)'
      }
    }
    return (
      <Hammer onTap={this.setReactionEmoji}>
        <div className="ReactionEmojis Grid-cell relative">
          <div className="Grid Grid--center-content absolute-container">
            <div style={styles.emoji}>
              {this.props.emoji}
            </div>
          </div>
        </div>
      </Hammer>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(crates, dispatch)
})

export default connect(null, mapDispatchToProps)(ReactionEmojis)
