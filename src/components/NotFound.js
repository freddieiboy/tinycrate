import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as newCrates from '../redux/modules/NewCrates';

const NotFound = ({actions}) => {
  actions.hideActionBar();
  return (
    <div className="404">
      <h1>404 Your page does not exist!</h1>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(newCrates, dispatch)
})

export default connect(null, mapDispatchToProps)(NotFound)
