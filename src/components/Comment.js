import React, {Component} from 'react';
import Modal from 'react-modal';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    }
  }
  openModal = () => {
    this.setState({modalIsOpen: true});
  }
  closeModal = () => {
    this.setState({modalIsOpen: false});
  }
  render() {
    const modalStyles = {
      content : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight : '-50%',
        transform: 'translate(-50%, -50%)'
      }
    }
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
}

export default Comment;
