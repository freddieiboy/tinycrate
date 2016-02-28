import React from 'react';

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <img src={this.props.authorProfilePicture} className="inventoryFeedAvatar"/>
        <div className="name">{this.props.name}</div>
        <img src={this.props.image} className="inventoryFeedImage"/>
        <p className="commentAuthor">
          {this.props.children}
        </p>
      </div>
    );
  }
});

module.exports = Comment;
