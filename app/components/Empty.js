import React from 'react';
import $ from 'jquery';
import Hammer from 'react-hammerjs';

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
    var is_ios = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
    var emoji;

    if (is_ios) {
      var emoji = 'emoji ios-emoji';
    } else {
      var emoji = 'emoji';
    }
    return(
      <Hammer onTap={this.emojiRandomizer}>
        <div className="empty-holder">
          <div className="outerEmpty">
            <div className="innerEmpty">
              {/*<div className="emoji" style={{fontSize: '46px', position: 'absolute', left: '47px', top: '40px'}}>*/}
              <div className={emoji}>
                <div className="empty-emoji animated pulse">{this.state.emptyEmoji}</div>
              </div>
              <img className="emptystate" src="http://i.imgur.com/5QybnJn.png"></img>
            </div>
          </div>
        </div>
      </Hammer>
    )
  }
});

module.exports = Empty;
