import React, {Component, PropTypes} from 'react'
import firebase from 'firebase'
import { Router, Route, Link, browserHistory } from 'react-router'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';
import * as userAuth from '../../redux/modules/userAuth';
import * as newCrates from '../../redux/modules/NewCrates';
import * as FireConfig from '../../redux/modules/FireConfig';
import Hammer from 'react-hammerjs';

import CrateTemplate from '../Crates/CrateTemplate';
import {CrateEmojis} from '../Emojis';

class LoginPage extends Component {
  componentDidMount = () => {
    //NOTE: why is this listening here?
    this.props.actions.startListeningToAuth();
    this.props.actions.hideActionBar();
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.store.userAuth.currently === 'LOGGED_IN') {
      console.log('you are logged in');
      // setTimeout(() => {
        this.props.actions.push('/');
      // }, 100)
      //NOTE: setTimeout creates infinite loop?
      this.props.actions.showActionBar();
    }
  }
  loginTwiter = () => {
    //TODO: add facebook login
    setTimeout(() => {
      this.props.actions.attemptLogin('twitter')
    }, 500)
  }
  render() {
    let {
      store,
      actions
    } = this.props;
    const styles = {
      LoginPage: {
        textAlign: 'center',
        height: '100vh'
      },
      title: {
        marginTop: '50px'
      },
      loginCrates: {
        display: 'inline-block',
        marginTop: '150px',
        textAlign: 'left'
      },
      twitterCrate: {
        float: 'left'
      },
      facebookCrate: {
        float: 'left',
        marginRight: '18px'
      },
      getStarted: {
        position: 'relative',
        display: 'inline-block',
        textAlign: 'left'
      },
      getStartedBG: {
        position: 'absolute',
        height: '375px',
        width: '375px',
        borderRadius: '50%',
        backgroundColor: '#F6F6F6',
        boxShadow: '0 0 0 14px #F6F6F6',
        border: '7px solid #fefdfa',
        marginLeft: '-138%',
        zIndex: '-1'
      },
      getStartedStripedBG: {
        left: '0px',
        width: '100vw',
        height: '30px',
      },
      getStartedCrate: {
        marginTop: '100px'
      },
      stripes: {
        position: 'absolute',
        zIndex: '-2',
        marginTop: '40px'
      },
      stripe1: {
        backgroundColor: '#57E3FD'
      },
      stripe2: {
        backgroundColor: '#C746E9'
      },
      stripe3: {
        backgroundColor: '#FFDF81'
      },
      stripe4: {
        backgroundColor: '#FB70AF'
      },
      stripe5: {
        backgroundColor: '#49FFCC'
      },
      stripe6: {
        backgroundColor: '#1ADEDB'
      },
      stripe7: {
        backgroundColor: '#2BBFD9'
      }
    }
    return (
      <div className="LoginPage" style={styles.LoginPage}>
        <header>
          <h1 style={styles.title}>Tinycrate</h1>
        </header>
        <div className="loginCrates" style={styles.loginCrates}>
          <div className="facebookCrate" style={styles.facebookCrate}>
            <CrateTemplate color={'facebook'} crateType={'login-facebook'} crateSize={80} pop={true}/>
          </div>
          <div className="twitterCrate" style={styles.twitterCrate} onMouseUp={this.loginTwiter} onTouchEnd={this.loginTwiter}>
            <CrateTemplate color={'twitter'} crateType={'login-twitter'} crateSize={80} pop={true}/>
          </div>
        </div>
        <footer>
          <div className="stripes" style={styles.stripes}>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe1)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe2)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe3)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe4)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe5)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe6)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe7)}></div>
          </div>
          <div className="getStarted" style={styles.getStarted}>
            <div className="getStartedBG" style={styles.getStartedBG}></div>
            <div className="getStartedCrate" style={styles.getStartedCrate}>
              <CrateTemplate color={'blue'} crateType={'test'} crateSize={100} pop={true}/>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

LoginPage.contextTypes = {
  router: PropTypes.object,
}

const mapStateToProps = (state) => ({
  store: {
    userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, routerActions, newCrates, userAuth, FireConfig), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
