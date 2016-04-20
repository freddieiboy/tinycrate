import React, {Component} from 'react';
import * as onboardingActions from '../../redux/modules/Onboarding';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';

class Onboarding extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.store.isTutorialMode === false) {
      this.props.actions.push('/');
    } else {
      console.log('still in tutorial mode')
    }
  }
  render() {
    let {actions} = this.props;
    return (
      <div className="Onboarding">
        <h1>This is onboarding.</h1>
        <button className="button" onClick={actions.finishTutorialMode}>Finish Tutorial Mode</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  store: {
    isTutorialMode: state.Onboarding.isTutorialMode
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, routerActions, onboardingActions), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding)
