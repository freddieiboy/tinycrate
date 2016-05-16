import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as appActions from '../redux/modules/crates';
import {Emojis, randomEmojiNumber} from './Emojis';

import {DefaultCrate, PressedCrate, pop1, pop2} from './Crates/CrateUtils';
import $ from 'jquery';
import Hammer from 'react-hammerjs';
import FlexCrateTemplate from './Crates/FlexCrateTemplate';

const Empty = ({ actions, store }) => {
  const styles = {

  }
  let userColor;
  if (store.user === null) {
    userColor = 'empty'
  } else {
    userColor = store.user.profileColor
  }
  return (
    <div className="empty Grid full-container">
      <div className="flex-1 relative">
        <div className="Grid Grid--center-content absolute full-container">
          <div onTouchEnd={() => actions.setEmojiNumber(randomEmojiNumber())}>
            <FlexCrateTemplate
              color={userColor}
              size={80}
              pop={2}
              type={'empty'}
              shadow={true}
              />
          </div>
          {/*<p style={{opacity: '.5'}}>Empty Dashboard</p>*/}
        </div>
      </div>
    </div>
  )
}

Empty.propTypes = {
  actions: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  store: {
    emoji: state.crates.emoji,
    user: state.userAuth.user
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(appActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Empty)
