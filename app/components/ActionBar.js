import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';
import {green, pink} from './Crates/CrateUtils';
import {Camera} from './ActionButtons';
import Hammer from 'react-hammerjs';
import Firebase from 'firebase';
import {Motion, spring} from 'react-motion';
import $ from 'jquery';

var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
var authData = ref.getAuth();

var ActionBar = React.createClass({
  getInitialState: function() {
    return {
      isOpened: false,
      mainButtonPosition: 0,
      mainButtonWidth: 0,
      user: {}
    }
  },
  componentDidMount: function() {
    const calculatedPosition = $('.optionsMenu').position().left;
    const calculatedWidth = $('.optionsMenu').width();
    const itself = this;
    var user = ref.getAuth();
    var userRef;

    this.setState({
      mainButtonPosition: calculatedPosition,
      mainButtonWidth: calculatedWidth
    });

    userRef = ref.child('users').child(user.uid);
    userRef.once('value', function (snap) {
      user = snap.val();
      if (!user) {
        return;
      }
      itself.setState({user: user});
    });
  },
  openAction: function() {
    var notOpened = !this.state.isOpened
    notOpened ? this.setState({isOpened: true}) : null
  },
  closeAction: function() {
    var isOpened = this.state.isOpened
    isOpened ? this.setState({isOpened: false}) : null

    browserHistory.push("/");
  },
  initPos: function() {
    return {
      left: spring(this.state.mainButtonPosition, {stiffness: 220, damping: 17}),
      opacity: spring(0)
    }
  },
  finalPos: function(id) {
    return {
      left: spring(this.state.mainButtonPosition - (this.state.mainButtonWidth * id), {stiffness: 320, damping: 17}),
      opacity: spring(1)
    }
  },
  setBtnPosition: function(position) {
    const isOpened = !this.state.isOpened;
    return Object.assign({}, isOpened && this.initPos(), !isOpened && this.finalPos(position))
  },
  newCrate: function(event) {
    browserHistory.push("create");
  },
  render: function() {
    const isOpened = !this.state.isOpened;
    return (
      <footer className="homeFooter" style={styles.homeFooter}>
        <Hammer onTap={this.openAction} threshold={400}>
          <div className="optionsMenu actionButton animated pulse" style={styles.optionsMenu} onClick={this.newCrate}>
            <div className="actionIcon" style={styles.createIcon}></div>
            <div className="actionIcon" style={{fontSize: '2em', color: '#fff'}}>+</div>
          </div>
        </Hammer>
        <Motion style={this.setBtnPosition(1)}>
          {({left, opacity}) =>
            <div className="actionButton" style={{left: left, opacity: opacity}} >
              <div className="actionIcon" style={{top: '2.2em'}}>
                <Camera />
              </div>
            </div>}
        </Motion>
        <Motion style={this.setBtnPosition(2)}>
          {({left, opacity}) =>
            <div className="userButton actionButton" style={{left: left, opacity: opacity}}>
              <div className="actionIcon">
                <img className="user-avatar" style={{height: 50, borderRadius: '50%', marginTop: 7}} src={this.state.user.profileImageURL}/>
              </div>
            </div>}
        </Motion>
        <Motion style={this.setBtnPosition(3)}>
          {({left, opacity}) =>
          <Hammer onTap={this.closeAction}>
            <div className="userButton actionButton" style={{left: left, opacity: opacity}}>
              <div className="actionIcon">
                <svg width="21px" height="21px" viewBox="0 0 21 21" version="1.1" style={{marginTop: 7}}>
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
                        <g transform="translate(-364.000000, -28.000000)" stroke="#FB70AF" strokeWidth="3">
                            <g transform="translate(358.000000, 22.000000)">
                                <path d="M15.314396,17.7097327 L6.19836287,17.7097327 C5.54112056,17.7097327 5.0083204,17.1769325 5.0083204,16.5196902 C5.0083204,15.8624479 5.54112056,15.3296477 6.19836287,15.3296477 L15.314396,15.3296477 L15.314396,6.19836287 C15.314396,5.54112056 15.8471962,5.0083204 16.5044385,5.0083204 C17.1616808,5.0083204 17.694481,5.54112056 17.694481,6.19836287 L17.694481,15.3296477 L26.8410175,15.3296477 C27.4982598,15.3296477 28.03106,15.8624479 28.03106,16.5196902 C28.03106,17.1769325 27.4982598,17.7097327 26.8410175,17.7097327 L17.694481,17.7097327 L17.694481,26.8410175 C17.694481,27.4982598 17.1616808,28.03106 16.5044385,28.03106 C15.8471962,28.03106 15.314396,27.4982598 15.314396,26.8410175 L15.314396,17.7097327 Z" transform="translate(16.519690, 16.519690) rotate(-45.000000) translate(-16.519690, -16.519690) "></path>
                            </g>
                        </g>
                    </g>
                </svg>
              </div>
            </div>
          </Hammer>}
        </Motion>
      </footer>
    )
  }
});

module.exports = ActionBar;

const styles = {
  homeFooter: {
    height: '4em',
    backgroundColor: green.lightColor// TODO: going to use the users color
  },
  optionsMenu: {
    position: 'absolute',
    top: '-2.5em',
    right: '2.5em',
    width: '5em',
    height: '5em',
    borderRadius: '50%',
    backgroundColor: '#fff',
    boxShadow: '1px 2px 4px 0px rgba(0,0,0,0.21)',
    zIndex: '100'
  },
  createIcon: {
    height: '2.5em',
    width: '2.5em',
    backgroundColor: pink.lightColor,
    borderRadius: 6
  },
  buttonStyle: {
    position: 'absolute',
    top: '-2em',
    width: '4em',
    height: '4em',
    borderRadius: '50%',
    backgroundColor: '#fff',
    boxShadow: '1px 2px 4px 0px rgba(0,0,0,0.21)',
  }
}

/*
This is how you add a button. Set the position with setBtnPosition(pos)
The main button is [0]. The position directly next to it is [1].
[2] is second and so forth.

<Motion style={this.setBtnPosition(pos)}>
  {({left, opacity}) =>
    <div className="actionButton" style={{left: left, opacity: opacity}}>
      <div className="actionIcon" style={{top: '2.2em'}}>
        ** ADD COMPONENT HERE **
        Ex. <Camera />
      </div>
    </div>}
</Motion>
*/
