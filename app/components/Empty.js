import React from 'react';

var Empty = React.createClass({
  getInitialState: function() {
    return {
      emptyEmoji: '❤︎'
    }
  },
  emojiRandomizer: function() {
    var emojis = ['😬','💛','💩','😽','📦','🎁','😱','😜','😍','😑','😨','🐈'];
    var randomEmoji = emojis[Math.floor(Math.random()*emojis.length)]
    return this.setState({emptyEmoji: randomEmoji})
  },
  render: function() {
    return(
      <div className="empty-holder" onTouchEnd={this.emojiRandomizer}>
        <div className="outerEmpty">
          <div className="innerEmpty">
            <div className="emoji" style={{fontSize: '46px', position: 'absolute', left: '47px', top: '0.1em'}}>
              <div className="empty-emoji animated pulse">{this.state.emptyEmoji}</div>
            </div>
            <img className="emptystate" src="http://i.imgur.com/5QybnJn.png"></img>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Empty;
