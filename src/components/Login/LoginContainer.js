import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';
import LoginView from './LoginView';
import * as userAuth from '../../redux/modules/userAuth';
import * as newCrates from '../../redux/modules/NewCrates';
import * as FireConfig from '../../redux/modules/FireConfig';
import * as onboarding from '../../redux/modules/Onboarding';

const fireRef = new Firebase("https://burning-heat-5122.firebaseio.com");

class LoginContainer extends Component {
  componentDidMount = () => {
    //NOTE: why is this listening here?
    this.props.actions.startListeningToAuth();
    this.props.actions.hideActionBar();
  }
  shouldComponentUpdate = (nextProps) => {
    return nextProps.store.userAuth.currently === this.props.store.userAuth.currently
  }
  componentWillUpdate() {
    const loggedIn = this.props.store.userAuth.currently === 'LOGGED_IN';
    if(loggedIn) {
      var userRef = fireRef.child('users').child(this.props.store.userAuth.uid);
      userRef.once('value', (snap) => {
        // if Firebase user doesn't exist or hasn't completed tutorial, start the onboarding
        if(snap.val() === null || !snap.val().didTutorial) {
          this.props.actions.push('getting-started');
        } else {
          this.props.actions.push('/');
        }
      });
    }
  }
  loginTwitter = () => {
    setTimeout(() => {
      this.props.actions.attemptLogin('twitter')
    }, 700)
  }
  loginFacebook = () => {
    setTimeout(() => {
      this.props.actions.attemptLogin('facebook')
    }, 700)
  }
  render() {
    return (
      <div className="LoginContainer">
        <LoginView loginTwitter={this.loginTwitter} loginFacebook={this.loginFacebook}/>
      </div>
    )
  }
}

LoginContainer.contextTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
