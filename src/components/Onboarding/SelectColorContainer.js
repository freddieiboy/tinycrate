import React, { Component } from 'react';
import * as onboardingActions from '../../redux/modules/Onboarding';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';
import CrateTemplate from '../Crates/CrateTemplate';

class SelectColorContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.store.isTutorialMode === false) {
      this.props.actions.push('/');
    } else {
      console.log('still in tutorial mode')
    }
  }
  render () {
    return (
      <div className="SelectProfileColor">
        <h1>SelectProfileColor</h1>
        <button className="button" onClick={this.props.actions.finishTutorialMode}>Finish Tutorial Mode</button>
        <CrateTemplate pop={true} crateType={'tutorial'} color={'green'} crateSize={80}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectColorContainer)
