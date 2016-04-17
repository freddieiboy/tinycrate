import React, {Component, PropTypes} from 'react'
import firebase from 'firebase'
import { Router, Route, Link, browserHistory } from 'react-router'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';
import * as userAuth from '../redux/modules/userAuth';
import * as newCrates from '../redux/modules/NewCrates';
import * as FireConfig from '../redux/modules/FireConfig';
import Hammer from 'react-hammerjs';

class LoginPage extends Component {
  componentDidMount = () => {
    //NOTE: why is this listening here?
    this.props.actions.startListeningToAuth();
    this.props.actions.hideActionBar();
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.store.userAuth.currently === 'LOGGED_IN') {
      console.log('you are logged in');
      // setTimeout(() => {
        this.props.actions.push('/');
      // }, 100)
      //NOTE: setTimeout creates infinite loop?
      this.props.actions.showActionBar();
    }
  }
  render() {
    let {
      store,
      actions
    } = this.props;
    return (
      <div className="Absolute-Center">
        <p style={{color: 'white', fontSize: '25px'}}>📦 TinyCrate 📦</p>
        <Hammer onTap={() => actions.attemptLogin('twitter')}>
          <button>Twitter Login</button>
        </Hammer>
        <Hammer>
          <button>Facebook Login</button>
        </Hammer>
      </div>
    );
  }
}

LoginPage.contextTypes = {
  router: PropTypes.object,
}

const mapStateToProps = (state) => ({
  store: {
    userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, routerActions, newCrates, userAuth, FireConfig), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
