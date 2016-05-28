import React, { Component, PropTypes } from 'react';
import { routerActions } from 'react-router-redux'
import ActionBar from 'components/NewCrates/ActionBar';
import milligram from 'milligram';
import '../../styles/core.scss';
import * as userAuth from '../../redux/modules/userAuth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isWhitelisted } from '../../components/utilities';
import firebase from 'firebase';
var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of its props, so we can
// define it with a plain javascript function...
class CoreLayout extends Component {
  componentWillMount() {
    var auth = ref.getAuth();
    if(auth != null) {
      if(!isWhitelisted(auth.uid)) {
        this.props.actions.push("desktop");
      }
    }
    this.props.actions.startListeningToAuth();
  }
  render() {
    let { children, actions } = this.props;
    const styles = {
      body: {
        overflowY: 'hidden'
      }
    }
    return (
      <div className='page-container' style={styles.body}>
        <div className='view-container'>
          {children}
          <ActionBar />
        </div>
      </div>
    );
  }
}

CoreLayout.propTypes = {
  children: PropTypes.element
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, routerActions, userAuth), dispatch)
})

export default connect(null, mapDispatchToProps)(CoreLayout)

//NOTE: this is exported to => routes/index.js
