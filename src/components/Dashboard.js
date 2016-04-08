import React, { Component, PropTypes } from 'react';
import {bindActionCreators, store, getState} from 'redux';
import {push} from 'react-router-redux';
import { connect } from 'react-redux';
import * as cratesRedux from '../redux/modules/crates';
import * as userAuth from '../redux/modules/userAuth';
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
var authData = ref.getAuth();

import * as FireConfig from '../redux/modules/FireConfig';
import * as FireRef from '../redux/modules/FireRef';
// var refs = new Firebase(config.firebaseRef);
// var refs = new Firebase("https://burning-heat-5122.firebaseio.com");

var unopenedCratesList = [];
var openedCratesList = []

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
      //TODO: remove this when you do firebase redux
    };
    let {store, dispatch} = this.props;
    if (store.userAuth.currently === 'LOGGED_IN') {
      console.log("User " + store.userAuth.uid + " is logged in with " + store.userAuth.provider);
    } else {
      console.log("User is logged out");
      this.props.dispatch(push("login"));
    }
  }
  showInventory = (event) => {
    this.props.dispatch(push("create"));
  }
  showProfile = () => {
    let username = this.props.store.userAuth.username;
    this.props.dispatch(push("user/" + username));
  }
  logout = () => {
    this.props.actions.logoutUser();
    //TODO: move this over to the profile. Profile component should be a function in order for refresh to work.
  }
  componentDidMount = () => {
    var unopenedCrates = new Firebase(FIREBASE_URL + "/crates");
    unopenedCratesList = [];
    //#Beta:0 refactor these two functions. console.log is being called like 200 times. why?
    unopenedCrates.orderByChild("recipientUId").equalTo(authData.uid).on("child_added", (snapshot) => {
      var crate = snapshot.val();
      crate.key = snapshot.key();
      if(crate.opened === false) {
        unopenedCratesList.push(crate);
      }
      this.setState({data:  unopenedCratesList});
    })

    unopenedCrates.orderByChild("public").equalTo(true).on("child_added", (snapshot) => {
      var crate = snapshot.val();
      crate.key = snapshot.key();
      if(crate.opened === false) {
        unopenedCratesList.push(crate);
      }
      // console.log(unopenedCratesList);
      this.setState({data:  unopenedCratesList});
    })
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

        <Hammer onTap={this.showProfile}>
          <div className="inventoryAction float-right">
            <div className="up-label float-right" style={{ color: 'white', padding: '5px 20px 0 0' }}>
              <a style={{color: '#000'}}>Profile</a>
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

const mapStateToProps = (state) => ({
  store: {
    data: state.crates.data,
    emoji: state.crates.emoji,
    userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, cratesRedux, FireConfig, FireRef, userAuth), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
