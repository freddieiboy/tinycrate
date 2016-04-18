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
        marginTop: '100px',
        textAlign: 'left'
      },
      twitterCrate: {
        float: 'left'
      },
      facebookCrate: {
        float: 'left',
        marginRight: '18px'
      }
    }
    return (
      <div className="LoginPage" style={styles.LoginPage}>
        <h1 style={styles.title}>Tinycrate</h1>
        <div className="loginCrates" style={styles.loginCrates}>
          <div className="facebookCrate" style={styles.facebookCrate}>
            <CrateTemplate color={'facebook'} crateType={'login-facebook'} crateSize={80} pop={true}/>
          </div>
          <div className="twitterCrate" style={styles.twitterCrate}>
            <CrateTemplate color={'twitter'} crateType={'login-twitter'} crateSize={80} pop={true}/>
          </div>
        </div>
        {/*<Hammer onTap={() => actions.attemptLogin('twitter')}>
          <button>Twitter Login</button>
        </Hammer>
        <Hammer>
          <button>Facebook Login</button>
        </Hammer>*/}
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
