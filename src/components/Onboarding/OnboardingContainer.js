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
import {registerUser, isUsernameAvailable, getProfileColor, updateSettings} from './OnboardingUtils';
import { trackEvent } from '../AnalyticsUtil';

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
    var itself = this;
    if (this.props.mode === 'settings') {
      this.setState({
        slide: 4,
        isSettingsMode: true
      });
      getProfileColor(function(profileColor) {
        itself.setState({
          selectedColor: (profileColor) ? profileColor : 'yellow',
          isSelectingColor: false,
        });
      });
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
    trackEvent("Select Color Button", {
      "color": color
    });
    this.setState({selectedColor: color, isSelectingColor: false})
    this.props.actions.changeProfileColor(color);
  }
  startSelectColor = () => {
    !this.state.isSelectingColor ? this.setState({isSelectingColor: true}) : null
  }
  endSelectColor = () => {
    this.state.isSelectingColor ? this.setState({isSelectingColor: false}) : null
  }
  leaveSettings = () => {
    var itself = this;
    updateSettings(this.state.selectedColor, function(error) {
      if(error) {
        console.log(error);
      } else {
        trackEvent("Update Settings Button");
        itself.setState({isSettingsMode: false});
      }
    });
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
    let profileImage;
    let profileName;
    let profileUsername;
    if (store.userAuth.user === null) {
      profileImage = 'http://i.imgur.com/Yo6CQFR.png'
      profileName = ''
      profileUsername = ''
    } else {
      var provider = store.userAuth.data.provider;
      if(provider === "twitter") {
        profileImage = this.state.isSettingsMode ? store.userAuth.user.profileImageURL : store.userAuth.data.twitter.profileImageURL
        profileName = this.state.isSettingsMode ? store.userAuth.user.name : store.userAuth.data.twitter.displayName
        profileUsername = this.state.isSettingsMode ? store.userAuth.user.username : store.userAuth.data.twitter.username
      } else {
        profileImage = this.state.isSettingsMode ? store.userAuth.user.profileImageURL : store.userAuth.data.facebook.profileImageURL
        profileName = this.state.isSettingsMode ? store.userAuth.user.name : store.userAuth.data.facebook.displayName
        profileUsername = this.state.isSettingsMode ? store.userAuth.user.username : store.userAuth.data.facebook.displayName.replace(/ /g,'')
      }
    }
    this.props.mode === 'settings' ? finish = this.leaveSettings : finish = this.attemptSignup
    return (
      <div className="Onboarding" style={styles.Onboarding}>
        {isEditingUserInfo ? (
          <UserInfoView
            userImage={profileImage}
            name={profileName}
            username={profileUsername}
            isUsernameAvailable={this.state.isUsernameAvailable}
            selectedColor={this.state.selectedColor}
            provider={store.userAuth.provider}
            isSettingsMode={this.state.isSettingsMode}
            />
        ) : (
          <SlideView
            mode={this.props.mode}
            startSelectColor={this.startSelectColor} endSelectColor={this.endSelectColor}
            selectColor={this.selectColor}
            selectedColor={this.state.selectedColor}
            slide={this.state.slide}
            logout={this.props.actions.logoutUser}
            />
        )}

        <div className="controlContainer" style={styles.controlContainer}>
          <ControlsView
            mode={this.props.mode}
            back={this.backSlide}
            next={this.nextSlide}
            slide={this.state.slide}
            selectedColor={this.state.selectedColor}
            userImage={profileImage}
            finish={finish}
            isSelectingColor={this.state.isSelectingColor}
            />
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
