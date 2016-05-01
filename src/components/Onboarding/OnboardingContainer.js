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
import $ from 'jquery';
import {registerUser, isUsernameAvailable} from './OnboardingUtils';

class SlideContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slide: 1,
      selectedColor: 'empty',
      isSelectingColor: false,
      isSettingsMode: false,
      isUsernameAvailable: true
    }
  }
  componentDidMount = () => {
    if (this.props.mode === 'settings') {
      this.setState({
        slide: 4,
        selectedColor: 'yellow',
        isSelectingColor: false,
        isSettingsMode: true
      })
    }
  }
  componentWillMount = () => {
    this.props.actions.startListeningToAuth();
  }
  componentWillUpdate = (nextProps, nextState) => {
    //NOTE: using this
    if (this.props.mode === 'settings') {
      nextState.isSettingsMode === false ? this.props.actions.push('/') : null
    } else {
      nextProps.store.isTutorialMode === false ? this.props.actions.push('/') : null
    }
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
  leaveSettings = () => {
    this.setState({isSettingsMode: false})
  }
  attemptSignup = () => {
    var itself = this;
    var username = $('#Username').val().replace(/[^a-z0-9\s]/gi, '');
    isUsernameAvailable(username, function(isAvailable) {
      if(isAvailable) {
        registerUser(itself.props.store.userAuth.data, username, itself.state.selectedColor, function(success) {
          if(success) {
            itself.props.actions.finishTutorialMode();
          }
        });
      } else {
        notie.alert(3, 'Username is not available.', 2);
        itself.setState({isUsernameAvailable: false});
      }
    });
  }
  render() {
    let {store, actions} = this.props;
    const styles = {
      Onboarding: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        height: '100%',
        backgroundColor: '#000'
      },
      controlContainer: {
        height: '30%',
        width: '100vw'
      }
    }
    const isEditingUserInfo = this.state.slide === 5;
    let finish;
    this.props.mode === 'settings' ? finish = this.leaveSettings : finish = this.attemptSignup
    return (
      <div className="Onboarding" style={styles.Onboarding}>
        {isEditingUserInfo ? (
          <UserInfoView
            userImage={store.userAuth.profileImageURL}
            name={store.userAuth.name}
            username={store.userAuth.username}
            isUsernameAvailable={this.state.isUsernameAvailable}
            selectedColor={this.state.selectedColor}
            provider={store.userAuth.provider}/>
        ) : (
          <SlideView
            mode={this.props.mode}
            startSelectColor={this.startSelectColor} endSelectColor={this.endSelectColor}
            selectColor={this.selectColor}
            selectedColor={this.state.selectedColor}
            slide={this.state.slide} />
        )}

        <div className="controlContainer" style={styles.controlContainer}>
          <ControlsView
            mode={this.props.mode}
            back={this.backSlide}
            next={this.nextSlide}
            slide={this.state.slide}
            selectedColor={this.state.selectedColor}
            userImage={store.userAuth.profileImageURL}
            finish={finish}
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
