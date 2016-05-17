import React, { Component } from 'react';

class ReactionEmojis extends Component {
  render() {
    const style = {
      ReactionEmojis: {

      }
    }
    return (
      <div className="ReactionEmojis">
        {console.log(this.props.emoji)}
      </div>
    )
  }
}

export default ReactionEmojis;
