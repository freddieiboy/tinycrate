import React, {Component, PropTypes} from 'react'
import firebase from 'firebase'
import { Router, Route, Link, browserHistory } from 'react-router'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';
import LoginButtons from './LoginButtons';
import * as userAuth from '../../redux/modules/userAuth';
import * as newCrates from '../../redux/modules/NewCrates';
import * as FireConfig from '../../redux/modules/FireConfig';
import * as onboarding from '../../redux/modules/Onboarding';
import Hammer from 'react-hammerjs';

import CrateTemplate from '../Crates/CrateTemplate';
import {CrateEmojis} from '../Emojis';

class LoginPage extends Component {
  componentDidMount = () => {
    //NOTE: why is this listening here?
    this.props.actions.startListeningToAuth();
  }
  shouldComponentUpdate() {
    return this.props.store.userAuth.currently !== this.props.store.userAuth.currently
  }
  componentWillUpdate() {
    console.log('this is updating!!')
    const loggedIn = this.props.store.userAuth.currently === 'LOGGED_IN';
    const tutorial = this.props.store.isTutorialMode === true
    if (loggedIn && tutorial) {
      this.props.actions.push('get-started');
    } else if (loggedIn) {
      this.props.actions.push('/');
    }
  }
  loginTwitter = () => {
    //TODO: add facebook login
    setTimeout(() => {
      this.props.actions.attemptLogin('twitter')
    }, 700)
  }
  render() {
    return (
      <loginButtons loginTwitter={this.loginTwitter}/>
    )
  }
}

LoginPage.contextTypes = {
  router: PropTypes.object,
}

const mapStateToProps = (state) => ({
  store: {
    userAuth: state.userAuth,
    isTutorialMode: state.Onboarding.isTutorialMode
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, onboarding, routerActions, newCrates, userAuth, FireConfig), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
