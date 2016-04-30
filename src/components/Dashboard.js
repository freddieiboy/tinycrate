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
import { UnwrappedIcon } from './NewCrates/Icons';
import $ from 'jquery';
import odometer from './odometer';

import firebase from 'firebase';
var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

// var unopenedCratesList = [];
var openedCratesList = [];
var updateUnwrappedCount = false;

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      data:[],
      isMounted: false
    };
  }
  componentWillMount = () => {
    // console.log('dashboard will mount')
    if (this.props.store.userAuth.username === 'guest') {
      this.setState({isMounted: false})
      this.props.actions.push('login');
    } else {
      this.setState({isMounted: true})
      this.props.actions.showActionBar();
      this.setupCratesList(this.props);
      updateUnwrappedCount = false;
    }
  }
  // componentDidMount = () => {
  //   this.updateOdometer();
  // }
  shouldComponentUpdate = (nextProps, nextState) => {
    const loggedIn = nextProps.store.userAuth.currently !== this.props.store.userAuth.currently;
    const hasCrates = this.state.data.length > 0;
    const hasUnwrappedCount = nextProps.store.user !== this.props.store.user
    return loggedIn || hasCrates || hasUnwrappedCount
  }
  componentWillUpdate(nextProps) {
    //NOTE: component is updating 4 times when there is a crate in cratelist. Why?
    if (nextProps.store.userAuth.currently === 'ANONYMOUS') {
      console.log("User is logged out");
      this.props.actions.push('login')
    }
    this.updateOdometer();
  }
  componentWillUnmount = () => {
    this.setState({isMounted: false});
    // console.log('component will unmount')
  }
  updateOdometer = () => {
    let unwrappedAmount;
    setTimeout(() => {
      if (this.props.store.user !== null) {
        unwrappedAmount = this.props.store.user.unwrappedCount
        if (!updateUnwrappedCount) {
          $('#lines').animateNumber({
            number: unwrappedAmount,
            easing: 'easeInQuad'
          }, 500);
          updateUnwrappedCount = true;
        }
      } else {
        unwrappedAmount = 0
      }
    }, 1)
  }
  setupCratesList = (props) => {
    let {store, actions} = props;

    const crates = new Firebase(FIREBASE_URL + "/crateFeed/" + store.userAuth.uid);
    let unopenedCratesList = [];
    crates.orderByChild("opened").equalTo(false).on("child_added", (snapshot) => {
      var crate =  snapshot.val();
      crate.key = snapshot.key();

      // let unopenedCratesList = this.props.store.cratesList;
      unopenedCratesList.push(crate);
      this.setState({data: unopenedCratesList})
      updateUnwrappedCount = false;
      //NOTE: switched back to setState for performance.
      // not needed? slows loading with lots of crates
      // return actions.setupCratesList(unopenedCratesList);
    });
  }
  showProfile = () => {
    let username = this.props.store.userAuth.username;
    this.props.actions.push("user/" + username);
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
      },
      profileContainer: {
        display: 'inline',
        float: 'right',
      },
      profileImageContainer: {
        height: '30px',
        width: '30px',
        float: 'right'
      },
      profileImage: {
        height: '100%',
        width: '100%',
        borderRadius: '50%',
      },
      count: {
        float: 'right',
        paddingRight: '10px',
        paddingTop: '3px',
        color: '#CFDBDC'
      },
      icon: {
        float: 'right',
        paddingRight: '10px',
        paddingTop: '6px'
      }
    }
    return (
      <div>
        {this.state.isMounted ? (
          <div>
            <div className="homeHeader" style={styles.homeHeader}>
              <h1 className="logoType">Tinycrate</h1>
            </div>
            <Hammer onTap={this.showProfile}>
              <div className="profileContainer" style={styles.profileContainer}>
                <div className="profileImageContainer" style={styles.profileImageContainer}>
                  <img src={store.userAuth.profileImageURL} style={styles.profileImage} alt=""/>
                </div>
                <div className="count" style={styles.count}>
                  <span id="lines">0</span>
                </div>
                <div className="icon" style={styles.icon}>
                  <UnwrappedIcon color={'#CFDBDC'}/>
                </div>
              </div>
            </Hammer>
            <div style={{padding: '22px'}} className="container-fluid body-content-home">
              <AbsoluteGrid items={this.state.data} displayObject={(<CrateList comment={this.state.data} onDelete={this.deleteObj} color={this.pickColor}/>)} responsive={true} itemHeight={100} itemWidth={92} />
              {this.state.data.length === 0 ? (
                <Empty />
              ) : null}
            </div>
          </div>
        ) : null}
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
    user: state.userAuth.user,
    cratesList: state.crates.cratesList
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, routerActions, cratesRedux, userAuth, newCrates), dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
