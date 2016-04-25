import React, {Component} from 'react';
import * as onboardingActions from '../../redux/modules/Onboarding';
import * as userAuth from '../../redux/modules/userAuth';
import * as FireConfig from '../../redux/modules/FireConfig';
import {green} from '../Crates/CrateUtils';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';
import ControlsView from './ControlsView';
import SlideView from './SlideView';
import UserInfoView from './UserInfoView';

class SlideContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slide: 1,
      selectedColor: 'empty',
      isSelectingColor: false
    }
  }
  componentWillMount = () => {
    this.props.actions.startListeningToAuth();
  }
  componentWillUpdate = (nextProps, nextState) => {
    nextProps.store.isTutorialMode === false ? this.props.actions.push('/') : null
  }
  backSlide = () => {
    let number = this.state.slide;
    number > 1 ? number-- : null
    this.setState({slide: number})
  }
  nextSlide = () => {
    let number = this.state.slide;
    number < 5 ? number++ : null
    this.setState({slide: number})
  }
  selectColor = (color) => {
    this.setState({selectedColor: color, isSelectingColor: false})
  }
  startSelectColor = () => {
    !this.state.isSelectingColor ? this.setState({isSelectingColor: true}) : null
  }
  endSelectColor = () => {
    this.state.isSelectingColor ? this.setState({isSelectingColor: false}) : null
  }
  render() {
    let {store, actions} = this.props;
    const styles = {
      Onboarding: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        height: '100vh',
        backgroundColor: '#000'
      },
      controlContainer: {
        height: '30%',
        width: '100vw'
      }
    }
    const isEditingUserInfo = this.state.slide === 5;
    return (
      <div className="Onboarding" style={styles.Onboarding}>
        {isEditingUserInfo ? (
          <UserInfoView
            userImage={store.userAuth.profileImageURL}
            name={store.userAuth.name}
            username={store.userAuth.username}
            selectedColor={this.state.selectedColor}
            provider={store.userAuth.provider}/>
        ) : (
          <SlideView
            startSelectColor={this.startSelectColor} endSelectColor={this.endSelectColor}
            selectColor={this.selectColor}
            selectedColor={this.state.selectedColor}
            slide={this.state.slide} />
        )}

        <div className="controlContainer" style={styles.controlContainer}>
          <ControlsView
            back={this.backSlide}
            next={this.nextSlide}
            slide={this.state.slide}
            selectedColor={this.state.selectedColor}
            userImage={store.userAuth.profileImageURL}
            finish={actions.finishTutorialMode}
            isSelectingColor={this.state.isSelectingColor}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  store: {
    isTutorialMode: state.Onboarding.isTutorialMode,
    userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, FireConfig, userAuth, routerActions, onboardingActions), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SlideContainer)
