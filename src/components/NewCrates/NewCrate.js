import React, { Component } from 'react';
import * as newCrates from '../../redux/modules/NewCrates';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

class NewCrate extends Component {
  componentDidMount = () => {
    this.props.actions.showActionBar();
  }
  render() {
    return (
      <div className="NewCrate"></div>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, routerActions, newCrates), dispatch),
})

export default connect(null, mapDispatchToProps)(NewCrate)
