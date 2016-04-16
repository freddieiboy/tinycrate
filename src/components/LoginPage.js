import React, {Component, PropTypes} from 'react'
import firebase from 'firebase'
import { Router, Route, Link, browserHistory } from 'react-router'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {push} from 'react-router-redux';
import * as userAuth from '../redux/modules/userAuth';
import * as newCrates from '../redux/modules/NewCrates';
import * as FireConfig from '../redux/modules/FireConfig';
import Hammer from 'react-hammerjs';

class LoginPage extends Component {
  componentDidMount = () => {
    this.props.actions.startListeningToAuth();
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.store.userAuth.currently === 'LOGGED_IN') {
      console.log('you are logged in');
      this.context.router.push('/');
      // nextProps.dispatch(push('/'));
      this.props.actions.showActionBar();
    }
  }
  render() {
    let {
      store,
      actions
    } = this.props;
    return (
      <div className="Absolute-Center">
        <p style={{color: 'white', fontSize: '25px'}}>📦 TinyCrate 📦</p>
        <Hammer onTap={() => actions.attemptLogin('twitter')}>
          <button>Twitter Login</button>
        </Hammer>
        <Hammer>
          <button>Facebook Login</button>
        </Hammer>
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
  actions: bindActionCreators(Object.assign({}, newCrates, userAuth, FireConfig), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
