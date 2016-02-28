import React from 'react';
import Comment from './Comment';
import firebase from 'firebase';

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      var imageUrl = comment.image;
      if(!imageUrl) {
        imageUrl = "http://www-cdr.stanford.edu/~petrie/blank.gif";
      }
      return (
        <Comment name={comment.authorDisplayName} key={comment.id} image={imageUrl} authorProfilePicture={comment.authorProfileImageURL}>
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
