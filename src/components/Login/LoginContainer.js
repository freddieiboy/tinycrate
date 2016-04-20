import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';
import LoginButtons from './LoginButtons';
import * as userAuth from '../../redux/modules/userAuth';
import * as newCrates from '../../redux/modules/NewCrates';
import * as FireConfig from '../../redux/modules/FireConfig';
import * as onboarding from '../../redux/modules/Onboarding';

class LoginContainer extends Component {
  componentDidMount = () => {
    //NOTE: why is this listening here?
    this.props.actions.startListeningToAuth();
  }
  // shouldComponentUpdate() {
  //   return this.props.store.userAuth.currently !== this.props.store.userAuth.currently
  // }
  componentWillUpdate() {
    console.log('this is updating!!')
    const loggedIn = this.props.store.userAuth.currently === 'LOGGED_IN';
    const tutorial = this.props.store.isTutorialMode === true
    if (loggedIn && tutorial) {
      this.props.actions.push('get-started');
      console.log('tutorial is active')
    } else if (loggedIn && !tutorial){
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
      <div className="LoginContainer">
        <LoginButtons loginTwitter={this.loginTwitter}/>
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
