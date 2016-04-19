import React, {Component} from 'react';
import Modal from 'react-modal';
import { uncollectCrate } from './Crates/CrateUtils';

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
  uncollectCrateButton = () => {
    if(confirm("Are you sure you want to remove this crate from your collection?")) {
      uncollectCrate(this.props.id);
    }
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
          <div className="name" style={{color: 'red', cursor: 'pointer'}} onClick={this.uncollectCrateButton}>[x]</div>
          <p className="commentAuthor">
            {this.props.children}
          </p>
      </div>
    );
  }
}

export default Comment;
