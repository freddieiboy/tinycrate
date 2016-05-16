import React, {Component} from 'react';
import Comment from './Comment';
import firebase from 'firebase';

class CommentList extends Component {
  render() {
    var commentNodes = this.props.data.map(comment => {
      var imageUrl = comment.image;
      if(!imageUrl) {
        imageUrl = "";
      }
      return (
        <Comment name={comment.authorDisplayName} id={comment.id} key={comment.id} image={imageUrl} authorProfilePicture={comment.authorProfileImageURL}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
}

export default CommentList;
