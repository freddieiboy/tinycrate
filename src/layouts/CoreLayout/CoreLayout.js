import React, { PropTypes } from 'react';
import ActionBar from 'components/NewCrates/ActionBar';
import '../../styles/core.scss';
import * as FireRef from '../../redux/modules/FireRef';
import * as FireConfig from '../../redux/modules/FireConfig';
import * as userAuth from '../../redux/modules/userAuth';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of its props, so we can
// define it with a plain javascript function...
const CoreLayout = ({ children, actions }) => {
  actions.setFirebaseRef("https://burning-heat-5122.firebaseio.com");
  actions.startListeningToAuth();
  return (
    <div className='page-container'>
      <div className='view-container'>
        {children}
        <ActionBar />
      </div>
    </div>
  );
}

CoreLayout.propTypes = {
  children: PropTypes.element
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, FireRef, FireConfig, userAuth), dispatch)
})

export default connect(null, mapDispatchToProps)(CoreLayout)

//NOTE: this is exported to => routes/index.js
