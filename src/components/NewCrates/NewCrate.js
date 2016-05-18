import React, { Component } from 'react';
import * as newCrates from '../../redux/modules/NewCrates';
import * as userAuth from '../../redux/modules/userAuth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import FlexCrateTemplate, { colors } from '../Crates/FlexCrateTemplate';
import SubscribersList from './SubscribersList'
import Hammer from 'react-hammerjs';
import { trackEvent } from '../AnalyticsUtil';

class NewCrate extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    let {store, actions} = this.props;

    this.initColor();
    actions.showActionBar();
    actions.openActionBar();
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    const crateColor = nextProps.store.newCrateColor !== this.props.store.newCrateColor
    const profile = nextProps.store.userAuth.user !== this.props.store.userAuth.user

    return crateColor || profile || true
  }
  onNewCrateTap = () => {
    trackEvent("Tap New Crate");
  }
  initColor = () => {
    let {store, actions} = this.props;

    actions.selectCrateColor(store.userAuth.user == null ? 'empty' : store.userAuth.user.profileColor)
  }
  randomColor = () => {
    const coolors = [
      "green",
      "yellow",
      "orange",
      "blue",
      "pink",
      "purple",
      "snow",
      "obsidian"
    ];
    this.props.actions.selectCrateColor(coolors[Math.floor(Math.random() * coolors.length)]);
  }
  render() {
    let {
      store,
      actions,
    } = this.props;

    let thisColor;
    let profileImage;
    if (store.userAuth.user == null) {
      profileImage = 'http://i.imgur.com/Yo6CQFR.png'
      thisColor = colors('empty')
    } else {
      profileImage = store.userAuth.user.profileImageURL
      thisColor = colors(store.userAuth.user.profileColor)
    }


    const styles = {
      NewCrate: {
        // height: '100%'
      },
      newCratePageTitle: {
        padding: '34px 0'
      },
      titleH4: {
        margin: '0px'
      },
      newCratePageBody: {
        position: 'relative'
      }
    }
    console.log(this.props.store.newCrateColor)
    let newCratePageTitle;
    let newCratePageBody;
    if (store.isCreatingCrate) {
      newCratePageTitle = store.regiftCrateText.length > 0 ? 'Regift Crate' : 'New Crate'
      newCratePageBody = <div className="flex-1 newCratePageBody relative">
        <Hammer onTap={() => this.onNewCrateTap()}>
        <div className="Grid Grid--full-center absolute full-container">
          <div onTouchStart={this.randomColor}>
            <FlexCrateTemplate
              color={store.newCrateColor === 'empty' ? thisColor : store.newCrateColor}
              size={120}
              pop={2}
              type={'normal'}
              preview={store.newCratePhoto}
              shadow={true}
              crateOwnerImage={profileImage}
              animation={'animated bounceInUp'}
              />
          </div>
        </div>
        </Hammer>
      </div>
    } else if (store.isSelectingUsers) {
      newCratePageTitle = 'Send To...'
      newCratePageBody = <div className="flex-1 newCratePageBody relative">
        <div className="Grid Grid--full-center full-height absolute">
          <SubscribersList
            subscribers={store.subscribers}
            newGifteeAction={actions.newGiftee}
            removeGifteeAction={actions.removeGiftee}
            myProfileColor={thisColor}
            />
        </div>
      </div>
    }
    return (
      <div className="NewCrate full-height Grid Grid--columns" styles={styles.NewCrate}>
        <div className="flex-auto">
          <div className="newCratePageTitle Grid--full-center Grid--center-text" style={styles.newCratePageTitle}>
            <h4 style={styles.titleH4}>{newCratePageTitle}</h4>
          </div>
        </div>
        {newCratePageBody}
        <div style={{flex: '0 128px'}}></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  store: {
    isCreatingCrate: state.NewCrates.isCreatingCrate,
    isSelectingUsers: state.NewCrates.isSelectingUsers,
    userAuth: state.userAuth,
    newCrateColor: state.NewCrates.newCrateColor,
    newCratePhoto: state.NewCrates.newCratePhoto,
    subscribers: state.NewCrates.subscribers,
    regiftCrateText: state.NewCrates.regiftCrateText
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, routerActions, newCrates, userAuth), dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewCrate)
