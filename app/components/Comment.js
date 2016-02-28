import React from 'react';

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <img src={this.props.image} className="inventoryFeedAvatar"/>
        <div className="name">{this.props.name}</div>
        <p className="commentAuthor">
          {this.props.children}
        </p>
      </div>
    );
  }
});

module.exports = Comment;
