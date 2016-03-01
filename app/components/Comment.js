import React from 'react';
import Modal from 'react-modal';

var Comment = React.createClass({
  getInitialState: function() {
    return { modalIsOpen: false };
  },
  openModal: function() {
    this.setState({modalIsOpen: true});
  },
  closeModal: function() {
    this.setState({modalIsOpen: false});
  },
  render: function() {
    return (
      <div className="comment">
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={modalStyles} >
          <img src={this.props.image} onClick={this.closeModal}/>
        </Modal>
          <img src={this.props.authorProfilePicture} className="inventoryFeedAvatar"/>
          <div className="name">{this.props.name}</div>
          <img src={this.props.image} className="inventoryFeedImage" onClick={this.openModal}/>
          <p className="commentAuthor">
            {this.props.children}
          </p>
      </div>
    );
  }
});

const modalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

module.exports = Comment;
