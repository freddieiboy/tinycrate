import React, { Component } from 'react';
import * as userAuth from '../redux/modules/userAuth';
import * as FireConfig from '../redux/modules/FireConfig';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';
import OnboardingContainer from './Onboarding/OnboardingContainer';



class Settings extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    console.log('settings mounted');
  }
  render() {
    const styles = {

    }
    return (
      <div className="Settings">
        <OnboardingContainer mode={'settings'} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  store: {
    // isTutorialMode: state.Onboarding.isTutorialMode,
    userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, FireConfig, userAuth, routerActions), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
