import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as appActions from '../redux/modules/crates';
import {Emojis, randomEmojiNumber} from './Emojis';

import {DefaultCrate, PressedCrate, pop1, pop2} from './Crates/CrateUtils';
import $ from 'jquery';
import Hammer from 'react-hammerjs';
import CrateTemplate from './Crates/CrateTemplate';

const Empty = ({ actions, store }) => {
  const style = {

  }
  return (
    <div className="empty" style={{height: '100%', position: 'relative'}}>
      <div className="emptyCrate center"
        onMouseUp={() => actions.setEmojiNumber(randomEmojiNumber())}
        onTouchEnd={() => actions.setEmojiNumber(randomEmojiNumber())}>
        <CrateTemplate color={'empty'} crateSize={80} cratePreview={'NOTHING_YET'} pop={true} popType={'2'} crateType={'empty'} shadow={'true'}/>
      </div>
    </div>
  )
}

Empty.propTypes = {
  actions: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  store: {
    emoji: state.crates.emoji
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(appActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Empty)
