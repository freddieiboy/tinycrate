import React, { Component, PropTypes } from 'react';
import {bindActionCreators, store, getState} from 'redux';
import {push} from 'react-router-redux';
import { connect } from 'react-redux';
import * as cratesRedux from '../redux/modules/crates';
import * as userAuth from '../redux/modules/userAuth';
import * as newCrates from '../redux/modules/NewCrates';
import ReactDOM from 'react-dom';

import LoginPage from './LoginPage';
import InventoryPage from './InventoryPage';
import CommentList from './CommentList';
import Comment from './Comment';
import CrateList from './Crates/CrateList';
import {green, pink} from './Crates/CrateUtils';
import Crate from './Crates/Crate';
import CreatePage from './CreatePage';
import Empty from './Empty';
import { Router, Route, Link, browserHistory } from 'react-router';
import AbsoluteGrid from 'react-absolute-grid';
import Hammer from 'react-hammerjs';

import firebase from 'firebase';
var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

// import * as FireConfig from '../redux/modules/FireConfig';
// import * as FireRef from '../redux/modules/FireRef';
var authData = ref.getAuth();
// var refs = new Firebase(config.firebaseRef);
// var refs = new Firebase("https://burning-heat-5122.firebaseio.com");

var unopenedCratesList = [];
var openedCratesList = []

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
      // _isMounted: false
    };
  }
  componentDidMount = () => {
    // this.setState({_isMounted: true}, () => {
    //   console.log(this.state._isMounted === true)
    // })

      // if (this.props.store.userAuth.currently !== 'LOGGED_IN') {
      //   console.log("User is logged out");
      //   setTimeout(() => {
      //     this.props.dispatch(push("login"));
      //   }, 1)
      // }

    var unopenedCrates = new Firebase(FIREBASE_URL + "/crates");
    unopenedCratesList = [];
    //#Beta:0 refactor these two functions. console.log is being called like 200 times. why?
    if (authData === null) {
      //TODO: this makes it so ONLY 'LOGGED_IN' is allowed to access the app.
      this.context.router.push('login');
      // this.props.dispatch(push('login'));
    } else {
      this.props.actions.showActionBar();

      unopenedCrates.orderByChild("recipientUId").equalTo(authData.uid).on("child_added", (snapshot) => {
        var crate = snapshot.val();
        crate.key = snapshot.key();
        if(crate.opened === false) {
          unopenedCratesList.push(crate);
        }
        // this.state._isMounted ? this.setState({data: unopenedCratesList}) : null
        // this.setState({data: unopenedCratesList})
        this.props.actions.setupCratesList(unopenedCratesList);
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.store.userAuth.currently !== 'LOGGED_IN') {
      console.log("User is logged out");
      this.context.router.push('login');
    }
    // console.log(nextProps)
  }
  shouldComponentUpdate = (nextProps) => {
    return nextProps.store != this.props.store;
  }
  // showInventory = (event) => {
  //   this.context.router.push('create');
  //   // this.props.dispatch(push("create"));
  // }
  showProfile = () => {
    let username = this.props.store.userAuth.username;
    // this.context.router.push('user/' + username);
    // this.props.dispatch(push('corgi'))
    this.context.router.push('corgi');
    // this.props.dispatch(push("user/" + username));
  }
  logout = () => {
    this.props.actions.logoutUser();
    //TODO: move this over to the profile. Profile component should be a function in order for refresh to work.
  }
  deleteObj = (data_id) => {
    console.log("deleting: " + data_id);

    var links = this.state.data;
    console.log("OLD LINKS: " + JSON.stringify(links));

    var newlinks = links.filter(function(elem) {
      return elem.key != data_id;
    });

    console.log("NEW LINKS: " + JSON.stringify(newlinks));

    this.setState({data: newlinks});
    this.context.router.push('crate/' + data_id);
    // this.props.dispatch(push("crate/" + data_id));
  }
  render() {
    let {
      actions,
      store
    } = this.props;
    const styles = {
      homeHeader: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: 65,
        padding: '15px 22px 38px 28px'
      }
    }
    return (
      <div>
        <div className="homeHeader" style={styles.homeHeader}>
          <h1 className="logoType">TinyCrate</h1>
        </div>

        <Hammer onTap={() => this.context.router.push('corgis')}>
          <div className="inventoryAction float-right">
            <div className="up-label float-right" style={{ color: 'white', padding: '5px 20px 0 0' }}>
              <a style={{color: '#000'}}><span style={{cursor: 'pointer'}}>Profile</span></a>
            </div>
          </div>
        </Hammer>

        <Hammer onTap={this.logout}>
          <div className="float-right">
            <button className="button">LOGOUT</button>
          </div>
        </Hammer>

        <div style={{padding: '22px'}} className="container-fluid body-content-home">
          <AbsoluteGrid items={this.state.data} displayObject={(<CrateList comment={this.state.data} onDelete={this.deleteObj} color={this.pickColor}/>)} responsive={true} itemHeight={100} itemWidth={92} />
          {this.state.data.length === 0 ? (
            <Empty />
          ) : (
            null
          )}
        </div>
      </div>
    );
  }
}

//NOTE: do we need this?
Dashboard.PropTypes = {
  data: PropTypes.array.isRequired,
  setEmojiNumber: PropTypes.object.isRequired,
  emoji: PropTypes.number.isRequired,
}

Dashboard.contextTypes = {
  router: PropTypes.object,
}

const mapStateToProps = (state) => ({
  store: {
    data: state.crates.data,
    emoji: state.crates.emoji,
    userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, cratesRedux, userAuth, newCrates), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
