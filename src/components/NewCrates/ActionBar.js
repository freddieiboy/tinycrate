import React, {Component, PropTypes} from 'react';
import { push } from 'react-router-redux';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as NewCrates from '../../redux/modules/NewCrates';
import Hammer from 'react-hammerjs';
import {Motion, spring} from 'react-motion';
import { routerActions } from 'react-router-redux';

import FilePicker from 'component-file-picker';
import EXIF from 'exif-js'
import {flattenObject, ifStyle} from '../utilities';
import $ from 'jquery';
import CrateTemplate, { colors } from 'components/Crates/CrateTemplate';
import {green, pink, incrementGiftedCount} from 'components/Crates/CrateUtils';
import SubscribersList from 'components/NewCrates/SubscribersList';
import {
  CameraIcon,
  CancelIcon,
  AirplaneIcon,
  NextIcon
} from 'components/NewCrates/Icons';

const FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";

class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.randomColor();
    this.state = {
      localText: ''
    }
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    const textIsDifferent = nextState.localText !== this.state.localText
    const isOpened = nextProps.store.isOpened !== this.props.store.isOpened
    //NOTE: alwaysUpdate is true to help debug. Don't use later.
    const alwaysUpdate = true
    return textIsDifferent || isOpened || alwaysUpdate
  }
  componentWillUpdate = (nextProps, nextState) => {
    const regiftText = nextProps.store.regiftCrateText;
    if (regiftText.length > 0 && this.state.localText === '') {
      this.setState({localText: regiftText})
      // console.log(nextState.localText.length, nextProps.store.regiftCrateText.length)
    }
  }
  componentDidMount = () => {
    //NOTE: why do I have to add setTimeout here?
    // console.log($('.bigPlusButton').width(), $('.bigPlusButton').position().left)
    this.props.actions.getBtnWidth($('.bigPlusButton').width());
    this.props.actions.getBtnPosition($('.bigPlusButton').position().left);

    const ref = new Firebase(FIREBASE_URL + "/users");
    var twitterUsers = [];
    ref.orderByChild("username").on("child_added", (snapshot) => {
      if(snapshot.val().username !== undefined) {
        twitterUsers.push({
          uid: snapshot.key(),
          name: snapshot.val().name,
          username: snapshot.val().username
        });
      }
      this.props.actions.loadSubscribers(twitterUsers);
    });
  }
  openAction = () => {
    if (!this.props.store.isOpened) {
      this.props.actions.push('new-crate');
      this.props.actions.openActionBar();
      // $('#message').focus();
    } else {
      console.log('already opened!')
    }
  }
  selectUsers = () => {
    let {store, actions} = this.props;
    if (this.state.localText.length > 0 || store.newCratePhoto.length > 0) {
      actions.selectGiftees();
      // $('#message').blur();
    } else {
      notie.alert(3, 'Your message cannot be empty!', 2);
    }
  }
  closeAction = () => {
    this.setState({localText: ''});
    this.props.store.isOpened ? this.props.actions.closeActionBar() : null
    this.props.actions.flushNewCrateState();
    this.props.actions.push('/');
    // $('#message').blur();
  }
  initPos = () => {
    return {
      left: spring(this.props.store.mainButtonPosition, {stiffness: 220, damping: 17}),
      opacity: spring(0)
    }
  }
  finalPos = (id) => {
    return {
      left: spring(this.props.store.mainButtonPosition - (this.props.store.mainButtonWidth * id), {stiffness: 320, damping: 17}),
      opacity: spring(1)
    }
  }
  setBtnPosition = (position) => {
    const isOpened = !this.props.store.isOpened;
    return Object.assign({}, isOpened && this.initPos(), !isOpened && this.finalPos(position))
  }
  footerHeight0() {
    return {
      height: spring(64)
    }
  }
  footerHeight1() {
    return {
      height: spring(128)
    }
  }
  loaded = () => {
    const isOpened = !this.props.store.isOpened;
    return Object.assign(
      {},
      isOpened && this.footerHeight0(),
      !isOpened && this.footerHeight1(),
      this.props.store.isSelectingUsers && this.footerHeight0()
    )
  }
  randomColor = () => {
    const colors = [
      "green",
      "yellow",
      "orange",
      "blue",
      "pink",
      "purple"
    ];
    this.props.actions.selectCrateColor(colors[Math.floor(Math.random() * 6)]);
  }
  selectFile = () => {
    var itself = this;
    // $('#message').blur();
    FilePicker({ accept: [ 'image/*'] }, (files) => {
      var reader = new FileReader();
      var file = files[0];
      reader.onload = (upload) => {
        EXIF.getData(file, function() {
          // if image has orientation data, use library to load and rotate it correctly
          if(EXIF.getTag(file, "Orientation")) {
            loadImage(
              upload.target.result,
              function (canvas) {
                // canvas loaded with base64 string of rotated image is returned by library
                // use toDataURL to retrieve the base64 string from the canvas
                itself.props.actions.addNewCratePhoto(canvas.toDataURL());
              },
              {
                orientation: EXIF.getTag(file, "Orientation")}
              );
            } else {
              // if there is no orientation data, load the original base64 string
              itself.props.actions.addNewCratePhoto(upload.target.result);
            }
          });
        }
        reader.readAsDataURL(file);
      });
    }
  sendCrate = () => {
    let {store, actions} = this.props;
    var reff = new Firebase(FIREBASE_URL);
    var authData = reff.getAuth();
    var postsRef = reff.child("crates");
    var user = reff.getAuth();
    var userRef = reff.child('users').child(user.uid);
    const receipients = store.giftee;

    userRef.once('value', (snap) => {
      var user = snap.val();
      if (!user) {
        return;
      }
      if (receipients.length > 0) {
        receipients.map(users => {
          var crate = {
            key: reff.push().key(),
            authorUId: store.userAuth.uid,
            authorDisplayName: store.userAuth.name,
            authorProfileImageURL: store.userAuth.profileImageURL,
            recipientUId: users,
            text: this.state.localText,
            crateColor: store.newCrateColor,
            image: (store.newCratePhoto == '') ? null : store.newCratePhoto,
            opened: false,
            createdAt: Firebase.ServerValue.TIMESTAMP
          };

          // https://www.firebase.com/blog/2015-10-07-how-to-keep-your-data-consistent.html
          // We should be implementing client-side fan-out for data consistency
          var path = crate.key;
          var fannedOutData = {};
          fannedOutData['/crateFeed/' + users + '/' + path] = crate;

          reff.update(fannedOutData, function(error) {
            if(error) {
              console.log(error);
            }
            // increment 'giftedCount' after sending a crate
            incrementGiftedCount();
          });
        })
        this.closeAction();
      } else {
        notie.alert(3, 'Your crate needs a receipient!', 2);
      }
    });
  }
  handleSend = (e) => {
    let {store, actions} = this.props;
    let text = this.state.localText.length;
    let photo = store.newCratePhoto.length;
    let giftee = store.giftee.length;

    let hasContentAndGiftee = giftee > 0 && (text > 0 || photo > 0);
    let noGifteeButContent = giftee <= 0 && (text > 0 || photo > 0);
    let noContentButGiftee = giftee > 0 && (text <= 0 && photo <= 0);

    if (e.which == 13 || e.which == undefined) {
      if (hasContentAndGiftee) {
        this.sendCrate();
      } else if (noGifteeButContent) {
        if (!store.isSelectingUsers) {
          this.selectUsers();
        } else {
          notie.alert(3, 'Your crate needs a receipient!', 2);
        }
      } else if (noContentButGiftee) {
        notie.alert(3, 'Your message cannot be empty!', 2);
      }
    }
  }
  handleChange = (event) => {
    // this.props.actions.addNewCrateText(event.target.value);
    this.setState({localText: event.target.value})
  }
  editCrate = () => {
    this.props.actions.editNewCrate();
    // $('#message').focus();
  }
  render() {
    let {
      actions,
      store,
      isOpened,
      openActionBar,
      closeActionBar
    } = this.props;
    const userColor = colors(store.userAuth.profileColor);
    const styles = {
      optionsMenu: {
        position: 'absolute',
        top: '-39px',
        right: '2.5em',
        width: '5em',
        height: '5em',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '1px 2px 4px 0px rgba(0,0,0,0.21)',
        zIndex: '100'
      },
      buttonStyle: {
        position: 'absolute',
        top: '-2em',
        width: '4em',
        height: '4em',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '1px 2px 4px 0px rgba(0,0,0,0.21)',
      },
      inputSend: {
        border: '0.1rem solid #d1d1d1',
        borderRadius: '0.4rem',
        boxShadow: 'none',
        height: '3.8rem',
        padding: '0.6rem 1rem',
        width: '100%',
        marginTop: 70,
        marginBottom: 0
      },
      done: {
        color: userColor.lightColor
      },
      hide: {
        visibility: 'hidden'
      }
    }
    const ifSelected = store.giftee.length > 0 ? userColor.lightColor : undefined;
    const ifMsg = this.state.localText.length > 0 || store.newCratePhoto.length > 0 ? userColor.lightColor : undefined;
    const ifPhoto = store.newCratePhoto.length > 0 ? userColor.lightColor : undefined;

    let mainIcon = <div><div className="actionIcon"></div><div className="actionIcon" style={{fontSize: '2em', color: userColor.lightColor, fontSize: '50px', fontWeight: 'bold'}}>+</div></div>
    let mainAction = this.openAction

    if (store.isCreatingCrate) {
      mainIcon = <div className="actionIcon" style={{top: '2.7em'}}><NextIcon color={ifMsg}/></div>
      mainAction = this.selectUsers
    } else if (store.isSelectingUsers) {
      mainIcon = <div className="actionIcon" style={{top: '2.7em'}}><AirplaneIcon color={ifSelected}/></div>
      mainAction = this.handleSend
    }
    return (
      <div style={ifStyle(
          store.isHidden && styles.hide
        )}>
        <div className="newCrateHolder">
          {store.isCreatingCrate ? (
            <div className="container-fluid body-content-create">
              <div className="centerCrate" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <CrateTemplate color={store.newCrateColor} crateSize={150} pop={true} popType={'2'} crateType={'normal'} cratePreview={store.newCratePhoto} shadow={'true'} crateOwnerImage={store.userAuth.profileImageURL}/>
              </div>
            </div>
          ) : null}
          {store.isSelectingUsers ? (
            <div className="container-fluid body-content-create">
              <div className="title" style={{textAlign: 'center'}}>
                <h4>Select Giftees</h4>
              </div>
              <SubscribersList
                userColor={userColor}
                subscribers={this.props.store.subscribers}
                newGifteeAction={this.props.actions.newGiftee}
                removeGifteeAction={this.props.actions.removeGiftee}/>
            </div>
          ) : null}
        </div>

        <div className="actionButtons">
          <Motion style={this.loaded()}>
            {({height}) =>
            <footer className="homeFooter" style={{backgroundColor: userColor.compliment, height: height}}>

              <Hammer onTap={mainAction}>
                <div className="bigPlusButton optionsMenu actionButton animated pulse" style={styles.optionsMenu}>
                  {mainIcon}
                </div>
              </Hammer>

              {store.isSelectingUsers ? (
                <div>
                  <Motion style={this.setBtnPosition(1)}>
                    {({left, opacity}) =>
                      <Hammer onTap={this.editCrate}>
                        <div className="actionButton" style={{left: left, opacity: opacity}} >
                          <div className="actionIcon noTouch" style={{top: '2.2em'}}>
                            <CrateTemplate color={store.newCrateColor} crateSize={30} pop={true} crateType={'pop'} shadow={'false'}/>
                          </div>
                        </div>
                      </Hammer>}
                  </Motion>
                  <Motion style={this.setBtnPosition(2)}>
                    {({left, opacity}) =>
                    <Hammer onTap={this.closeAction}>
                      <div className="userButton actionButton" style={{left: left, opacity: opacity}}>
                        <div className="actionIcon">
                          <CancelIcon />
                        </div>
                      </div>
                    </Hammer>}
                  </Motion>
                </div>
              ) : (
                <div>
                  <Motion style={this.setBtnPosition(1)}>
                    {({left, opacity}) =>
                      <Hammer onTap={this.selectFile}>
                        <div className="actionButton" style={{left: left, opacity: opacity}} >
                          <div className="actionIcon" style={{top: '2.2em'}}>
                            <CameraIcon color={ifPhoto}/>
                          </div>
                        </div>
                      </Hammer>}
                  </Motion>
                  <Motion style={this.setBtnPosition(2)}>
                    {({left, opacity}) =>
                      <Hammer onTap={this.randomColor}>
                        <div className="userButton actionButton" style={{left: left, opacity: opacity}}>
                          <div className="actionIcon">
                            <img className="user-avatar" style={{height: 50, borderRadius: '50%', marginTop: 7}} src={store.userAuth.profileImageURL}/>
                          </div>
                        </div>
                      </Hammer>}
                  </Motion>
                  <Motion style={this.setBtnPosition(3)}>
                    {({left, opacity}) =>
                    <Hammer onTap={this.closeAction}>
                      <div className="userButton actionButton" style={{left: left, opacity: opacity}}>
                        <div className="actionIcon">
                          <CancelIcon />
                        </div>
                      </div>
                    </Hammer>}
                  </Motion>
                </div>
              )}

              {/*NOTE: This input shows up after init click.*/}
              { store.isCreatingCrate ? (
                <div className="clearfix" style={{padding: '0 20px 0 20px'}}>
                  <input id="message" placeholder='crate message...' className="inputSend" style={styles.inputSend} value={this.state.localText} onChange={this.handleChange} onKeyUp={this.handleSend}></input>
                </div>
              ) : (
                null
              )}
            </footer>
          }
          </Motion>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  store: {
    isOpened: state.NewCrates.isOpened,
    isCreatingCrate: state.NewCrates.isCreatingCrate,
    isSelectingUsers: state.NewCrates.isSelectingUsers,
    mainButtonPosition: state.NewCrates.mainButtonPosition,
    mainButtonWidth: state.NewCrates.mainButtonWidth,
    userAuth: state.userAuth,
    newCrateColor: state.NewCrates.newCrateColor,
    newCrateText: state.NewCrates.newCrateText,
    newCratePhoto: state.NewCrates.newCratePhoto,
    subscribers: state.NewCrates.subscribers,
    giftee: state.NewCrates.giftee,
    isHidden: state.NewCrates.isHidden,
    regiftCrateText: state.NewCrates.regiftCrateText
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, NewCrates, routerActions), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar)

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
