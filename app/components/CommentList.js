import React from 'react';

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment name={comment.authorDisplayName} key={comment.id} image={comment.authorProfileImageURL}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList" style={{padding: '15px'}}>
        {commentNodes}
      </div>
    );
  }
});

module.exports = CommentList;
