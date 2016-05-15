import React, {Component} from 'react';
import { uncollectCrate } from './Crates/CrateUtils';
import { getPswpElement } from './utilities';
import $ from 'jquery';

class Comment extends Component {
  constructor(props) {
    super(props);
  }
  viewPhoto = () => {
    var itself = this;

    getPswpElement(function(pswpElement) {
      var image = new Image();
      image.src = itself.props.image;

      var slides = [
        {
          src: itself.props.image,
          msrc: itself.props.image,
          w: image.naturalWidth,
          h: image.naturalHeight
        }
      ];
      var options = {
        closeOnScroll: false,
        shareEl: false
      };

      var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
      gallery.init();
    });
  }
  uncollectCrateButton = () => {
    if(confirm("Are you sure you want to remove this crate from your collection?")) {
      uncollectCrate(this.props.id);
    }
  }
  render() {
    return (
      <div className="comment">
          <div className="name">{this.props.name}</div>
          <img id="collectedCrateImageThumbnail" src={this.props.image} className="inventoryFeedImage" onClick={this.viewPhoto}/>
          <div className="name" style={{color: 'red', cursor: 'pointer'}} onClick={this.uncollectCrateButton}>[x]</div>
          <p className="commentAuthor">
            {this.props.children}
          </p>
      </div>
    );
  }
}

export default Comment;
