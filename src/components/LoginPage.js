import React, {Component} from 'react'
import firebase from 'firebase'
import { Router, Route, Link, browserHistory } from 'react-router'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {push} from 'react-router-redux';
import * as userAuth from '../redux/modules/userAuth';
import Hammer from 'react-hammerjs';

const LoginPage = ({ store, actions, dispatch }) => {
  if (store.userAuth.currently === 'LOGGED_IN') {
    console.log('you are logged in');
    dispatch(push('/'));
  } else {
    console.log('you are NOT logged in from login screen');
  }
  return (
    <div className="Absolute-Center">
      <p style={{color: 'white', fontSize: '25px'}}>📦 TinyCrate 📦</p>
      <Hammer onTap={() => actions.attemptLogin('twitter')}>
        <button>Twitter Login</button>
      </Hammer>
      <Hammer onTap={actions.attemptLogin}>
        <button>Facebook Login</button>
      </Hammer>
    </div>
  );
}

const mapStateToProps = (state) => ({
  store: {
    userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(userAuth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
