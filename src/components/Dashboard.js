import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { bindActionCreators, store, getState } from 'redux';
import { routerActions } from 'react-router-redux'
import { connect } from 'react-redux';
import * as cratesRedux from '../redux/modules/crates';
import * as userAuth from '../redux/modules/userAuth';
import * as newCrates from '../redux/modules/NewCrates';

import CommentList from './CommentList';
import Comment from './Comment';
import CrateList from './Crates/CrateList';
import {green, pink} from './Crates/CrateUtils';
import Crate from './Crates/Crate';
import Empty from './Empty';
import AbsoluteGrid from 'react-absolute-grid';
import Hammer from 'react-hammerjs';

import firebase from 'firebase';
var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);
// var authData = ref.getAuth();

var unopenedCratesList = [];
var openedCratesList = []

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    let {store, actions} = this.props;

    actions.showActionBar();
    const crates = new Firebase(FIREBASE_URL + "/crateFeed/" + store.userAuth.uid);

    crates.orderByChild("opened").equalTo(false).on("child_added", (snapshot) => {
      var crate =  snapshot.val();
      crate.key = snapshot.key();

      let unopenedCratesList = this.props.store.cratesList;

      unopenedCratesList.push(crate);
      // not needed? slows loading with lots of crates
      // return actions.setupCratesList(unopenedCratesList);
    });
  }
  shouldComponentUpdate(nextProps) {
    const loggedIn = nextProps.store.userAuth.currently !== this.props.store.userAuth.currently;
    const hasCrates = this.props.store.cratesList.length > 0;

    return loggedIn || hasCrates
  }
  componentWillUpdate(nextProps) {
    console.log('dashboard is updating!')
    //NOTE: component is updating 4 times when there is a crate in cratelist. Why?
    //NOTE: will need this check again. make it work once above is fullfilled
    if (nextProps.store.userAuth.currently === 'ANONYMOUS') {
      console.log("User is logged out");
      this.props.actions.push('login')
    }
  }
  showProfile = () => {
    let username = this.props.store.userAuth.username;
    this.props.actions.push("user/" + username);
  }
  logout = () => {
    this.props.actions.logoutUser();
    //TODO: move this over to the profile.
  }
  deleteObj = (crateId) => {
    var oldCrates = this.props.store.cratesList;
    // locally removes the crate by filtering it out by its id
    var newCrates = oldCrates.filter(function(crate) {
      return crate.key != crateId;
    });

    // this.props.actions.setupCratesList(newlinks)

    this.props.actions.push('crate/' + crateId);
    // this.props.dispatch(push("crate/" + data_id));
  }
  moveToDummyPage = () =>  {
    // this.props.actions.push('corgis')
    let username = this.props.store.userAuth.username;
    this.props.actions.push('user/' + username)
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

        <Hammer onTap={this.moveToDummyPage}>
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
          <AbsoluteGrid items={this.props.store.cratesList} displayObject={(<CrateList comment={this.state.data} onDelete={this.deleteObj} color={this.pickColor}/>)} responsive={true} itemHeight={100} itemWidth={92} />
          {store.cratesList.length === 0 ? (
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
// Dashboard.PropTypes = {
//   data: PropTypes.array.isRequired,
//   setEmojiNumber: PropTypes.object.isRequired,
//   emoji: PropTypes.number.isRequired,
// }

const mapStateToProps = (state) => ({
  store: {
    // data: state.crates.data,
    // emoji: state.crates.emoji,
    userAuth: state.userAuth,
    cratesList: state.crates.cratesList
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, routerActions, cratesRedux, userAuth, newCrates), dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
