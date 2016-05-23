import React, { Component } from 'react';
import * as newCrates from '../../redux/modules/NewCrates';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class GifTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    }
  }
  setSelectedPhoto = (event) => {
    this.props.actions.addNewCratePhoto(this.props.item.images.original.url);
    if (!this.state.isSelected) {
      this.setState({isSelected: true})
    } else {
      this.setState({isSelected: false})
      this.props.actions.addNewCratePhoto("");
    }
  }
  componentWillUpdate = () => {
    if (this.props.store.newCratePhoto !== this.props.item.images.original.url && this.state.isSelected) {
      this.setState({isSelected: false})
    }
  }
  render() {
    const styles = {
      gifTileContainer: {
        opacity: !this.state.isSelected && this.props.store.newCratePhoto ? '0.2' : '1'
      },
      gifTile: {
        maxWidth: '90px',
        maxHeight: '90px'
      }
    }
    return (
      <div>
        <div style={styles.gifTileContainer}
          onTouchEnd={this.setSelectedPhoto}>
            <img src={this.props.item.images.original.url} style={styles.gifTile}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  store: {
    newCratePhoto: state.NewCrates.newCratePhoto
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(newCrates, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(GifTile)