import React from 'react';
import ReactDOM from 'react-dom';
import {green, pink} from './Crates/CrateUtils';
import Hammer from 'react-hammerjs';
import {Motion, Spring} from 'react-motion';
import $ from 'jquery';

var ActionBar = React.createClass({
  getInitialState: function() {
    return {
      isOpened: false,
      mainButtonPosition: null,
      mainButtonWidth: null
    }
  },
  componentDidMount: function() {
    const calculatedPosition = $('.optionsMenu').position().left;
    const calculatedWidth = $('.optionsMenu').width();
    this.setState({
      mainButtonPosition: calculatedPosition,
      mainButtonWidth: calculatedWidth
    })
  },
  openAction: function() {
    var isOpened = !this.state.isOpened
    isOpened ? this.setState({isOpened: true}) : this.setState({isOpened: false})
  },
  initPos: function() {
    return {
      position: 'absolute',
      top: '-2em',
      left: this.state.mainButtonPosition,
      opacity: 0
    }
  },
  finalPos: function(id) {
    return {
      position: 'absolute',
      top: '-2em',
      left: this.state.mainButtonPosition - (this.state.mainButtonWidth * id),
      width: '4em',
      height: '4em',
      borderRadius: '50%',
      backgroundColor: '#fff',
      boxShadow: '1px 2px 4px 0px rgba(0,0,0,0.21)',
      opacity: 1
    }
  },
  render: function() {
    const isOpened = !this.state.isOpened;
    return (
      <Hammer onTap={this.openAction}>
        <footer className="homeFooter" style={styles.homeFooter}>
          <div className="optionsMenu actionButton animated pulse"style={styles.optionsMenu}>
            <div className="actionIcon" style={styles.createIcon}></div>
            <div className="actionIcon" style={{fontSize: '2em', color: '#fff'}}>+</div>
          </div>
          <div className="photoButton actionButton" style={Object.assign({}, isOpened && this.initPos(), !isOpened && this.finalPos(1))}>
            <div className="actionIcon cameraIcon" style={{top: '2.2em'}}><Camera /></div>
          </div>
          <div className="photoButton actionButton" style={Object.assign({}, isOpened && this.initPos(), !isOpened && this.finalPos(2))}>
            <div className="actionIcon cameraIcon" style={{top: '2.2em'}}><Camera /></div>
          </div>
        </footer>
      </Hammer>
    )
  }
});

module.exports = ActionBar;

const Camera = () =>
  <svg width="23px" height="18px" viewBox="0 0 23 18">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-225.000000, -348.000000)" fill="#FB70AF">
              <g transform="translate(0.000000, 310.000000)">
                  <g transform="translate(207.000000, 16.000000)">
                      <path d="M36.2790698,25.1162791 L39.0685512,25.1162791 C39.8447011,25.1162791 40.4651163,25.7438867 40.4651163,26.5180799 L40.4651163,37.6679666 C40.4651163,38.4339567 39.8398528,39.0697674 39.0685512,39.0697674 L19.5361,39.0697674 C18.75995,39.0697674 18.1395349,38.4421598 18.1395349,37.6679666 L18.1395349,26.5180799 C18.1395349,25.7520899 18.7647984,25.1162791 19.5361,25.1162791 L25.1162791,25.1162791 L25.1162791,23.7340031 C25.1162791,22.9442137 25.7391427,22.3255814 26.5074839,22.3255814 L34.8878649,22.3255814 C35.6469261,22.3255814 36.2790698,22.9561533 36.2790698,23.7340031 L36.2790698,25.1162791 Z M30.6976744,37.6744186 C33.7801941,37.6744186 36.2790698,35.1755429 36.2790698,32.0930233 C36.2790698,29.0105036 33.7801941,26.5116279 30.6976744,26.5116279 C27.6151547,26.5116279 25.1162791,29.0105036 25.1162791,32.0930233 C25.1162791,35.1755429 27.6151547,37.6744186 30.6976744,37.6744186 Z M30.6976744,34.8837209 C32.2389343,34.8837209 33.4883721,33.6342831 33.4883721,32.0930233 C33.4883721,30.5517634 32.2389343,29.3023256 30.6976744,29.3023256 C29.1564146,29.3023256 27.9069767,30.5517634 27.9069767,32.0930233 C27.9069767,33.6342831 29.1564146,34.8837209 30.6976744,34.8837209 Z" id="Camera"></path>
                  </g>
              </g>
          </g>
      </g>
  </svg>

// onClick={this.props.showCreate} => changes route. Add this back when done.

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
    boxShadow: '1px 2px 4px 0px rgba(0,0,0,0.21)'
  },
  createIcon: {
    height: '2.5em',
    width: '2.5em',
    backgroundColor: pink.lightColor,
    borderRadius: 6
  }
}
