import React, { Component } from 'react';
import * as newCrates from '../../redux/modules/NewCrates';
import * as userAuth from '../../redux/modules/userAuth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import FlexCrateTemplate, { colors } from '../Crates/FlexCrateTemplate';
import SubscribersList from './SubscribersList'

class NewCrate extends Component {
  componentDidMount = () => {
    this.props.actions.showActionBar();
    this.props.actions.openActionBar();
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

    let newCratePageTitle;
    let newCratePageBody;
    if (store.isCreatingCrate) {
      newCratePageTitle = 'New Crate'
      newCratePageBody = <div className="flex-1 newCratePageBody relative">
        <div className="Grid Grid--full-center absolute full-container">
          <FlexCrateTemplate
            color={store.newCrateColor}
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
    } else if (store.isSelectingUsers) {
      newCratePageTitle = 'Select Giftees'
      newCratePageBody = <div className="flex-1 newCratePageBody">
        <div className="Grid Grid--full-center full-width">
          <SubscribersList
            userColor={thisColor}
            subscribers={store.subscribers}
            newGifteeAction={actions.newGiftee}
            removeGifteeAction={actions.removeGiftee}
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
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, routerActions, newCrates, userAuth), dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewCrate)
