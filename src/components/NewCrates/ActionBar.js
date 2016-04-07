import React, {Component, PropTypes} from 'react';
import { push } from 'react-router-redux';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as NewCrates from '../../redux/modules/NewCrates';
import Hammer from 'react-hammerjs';
import {Motion, spring} from 'react-motion';

import FilePicker from 'component-file-picker';
import $ from 'jquery';
import CrateTemplate from 'components/Crates/CrateTemplate';
import {green, pink} from 'components/Crates/CrateUtils';
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
    this.selectRandomColor();
  }
  componentDidMount = () => {
    this.props.actions.getBtnPosition($('.optionsMenu').position().left);
    this.props.actions.getBtnWidth($('.optionsMenu').width());

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
      //NOTE: is it possible to write to redux once it's done instead of iteration?
    });
  }
  openAction = () => {
    if (!this.props.store.isOpened) {
      $('#message').focus();
      this.props.actions.openActionBar();
    } else {
      console.log('already opened!')
    }
  }
  selectUsers = () => {
    console.log('select users now');
    this.props.actions.selectGiftees();
    $('#message').blur();
  }
  closeAction = () => {
    this.props.store.isOpened ? this.props.actions.closeActionBar() : null
    //TODO: flush redux on exit
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
    return Object.assign({}, isOpened && this.footerHeight0(), !isOpened && this.footerHeight1())
  }
  selectRandomColor = () => {
    const randomColor = () => {
      const colors = [
        "green",
        "yellow",
        "orange",
        "blue",
        "pink",
        "purple"
      ];
      return colors[Math.floor(Math.random() * 6)];
    }
    this.props.actions.selectCrateColor(randomColor())
  }
  selectFile = () => {
    FilePicker({ accept: [ 'image/*'] }, (files) => {
      var reader = new FileReader();
      var file = files[0];
      reader.onload = (upload) => {
        // base64 string of image
        this.props.actions.addNewCratePhoto(upload.target.result)
        // this.setState({image: upload.target.result});
        $("#imagePreview").attr('src', this.props.store.newCratePhoto);
      }
      reader.readAsDataURL(file);
    });
  }
  sendCrate = () => {
    // var itself = this;
    var reff = new Firebase(FIREBASE_URL);
    var authData = reff.getAuth();
    var postsRef = reff.child("crates");
    var newPostRef = postsRef.push();
    var user = reff.getAuth();
    var userRef = reff.child('users').child(user.uid);

    //NOTE: get active user
    var username = $('input[role="combobox"]').val();
    var recipientUser = this.props.store.subscribers.filter((elem) => {
      return elem.username === this.props.store.giftee;
    }).pop();

    //NOTE: will the above work? check it out
    userRef.once('value', (snap) => {
      var user = snap.val();
      if (!user) {
        return;
      }
      if(recipientUser) {
        console.log(recipientUser.uid);
        newPostRef.set({
          authorUId: authData.uid,
          authorDisplayName: user.name,
          authorProfileImageURL: user.profileImageURL,
          recipientUId: recipientUser.uid,
          text: this.props.store.newCrateText,
          crateColor: this.selectRandomNumber(),
          image: (this.state.image == '') ? null : this.state.image,
          opened: false,
          createdAt: Firebase.ServerValue.TIMESTAMP
        });
        this.closeAction();
      } else {
        newPostRef.set({
          authorUId: authData.uid,
          authorDisplayName: user.name,
          public: true,
          crateColor: this.props.store.newCrateColor,
          authorProfileImageURL: user.profileImageURL,
          text: this.props.store.newCrateText,
          opened: false,
          createdAt: Firebase.ServerValue.TIMESTAMP
        });
        this.closeAction();
      }
    });
  }
  handleSendCrateKeyboard = (e) => {
    // var itself = this;
    // var text = e.target.value;
    if (e.which == 13) {
      // var text = e.target.value;
      if (this.props.store.newCrateText.length > 0) {
        // this.setState({showNotification: true});
        setTimeout(() => {
          // this.sendCrate(text);
          this.sendCrate();
        }, 2000);
      } else {
        alert("Your message cannot be empty!");
      }
    }
  }
  handleChange = (event) => {
    this.props.actions.addNewCrateText(event.target.value);
  }
  render() {
    let {
      actions,
      store,
      isOpened,
      openActionBar,
      closeActionBar
    } = this.props;
    const styles = {
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
      createBgIcon: {
        height: '2.5em',
        width: '2.5em',
        backgroundColor: pink.lightColor,
        borderRadius: 6
      },
      nextBgIcon: {
        height: '3em',
        width: '3em',
        backgroundColor: pink.lightColor,
        borderRadius: '50%'
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
      }
    }
    return (
      <div>
        <div className="newCrateHolder">
          {store.isCreatingCrate ? (
            <div className="container-fluid body-content-create">
              <div className="centerCrate" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <CrateTemplate color={store.newCrateColor} crateSize={150} pop={true}/>
              </div>
              <img id="imagePreview" style={{height: 50, width: 50, border: '1px solid black'}}></img>
            </div>
          ) : null}
          {store.isSelectingUsers ? (
            <div className="container-fluid body-content-create">
              <div className="title" style={{textAlign: 'center'}}>
                <h4>Select Giftees</h4>
              </div>
              <SubscribersList subscribers={this.props.store.subscribers} newGiftee={this.props.actions.newGiftee}/>
            </div>
          ) : null}
        </div>

        <div className="actionButtons">
          <Motion style={this.loaded()}>
            {({height}) =>
            <footer className="homeFooter" style={{backgroundColor: green.lightColor, height: height}}>
              {store.isOpened ? (
              <Hammer onTap={this.selectUsers}>
                <div className="optionsMenu actionButton" style={styles.optionsMenu}>
                    {store.isSelectingUsers ? (
                      <div className="actionIcon" style={{top: '2.7em'}}>
                        <AirplaneIcon />
                      </div>
                    ) : (
                      <div>
                        <div className="actionIcon" style={styles.nextBgIcon}/>
                        <div className="actionIcon" style={{top: '2.7em'}}>
                          <NextIcon />
                        </div>
                      </div>
                    )}
                </div>
              </Hammer>
              ) : (
              <Hammer onTap={this.openAction}>
                <div className="optionsMenu actionButton animated pulse" style={styles.optionsMenu}>
                  <div className="actionIcon" style={styles.createBgIcon}></div>
                  <div className="actionIcon" style={{fontSize: '2em', color: '#fff'}}>+</div>
                </div>
              </Hammer>
              )}
              <Motion style={this.setBtnPosition(1)}>
                {({left, opacity}) =>
                  <Hammer onTap={this.selectFile}>
                    <div className="actionButton" style={{left: left, opacity: opacity}} >
                      <div className="actionIcon" style={{top: '2.2em'}}>
                        <CameraIcon />
                      </div>
                    </div>
                  </Hammer>}
              </Motion>
              <Motion style={this.setBtnPosition(2)}>
                {({left, opacity}) =>
                  <div className="userButton actionButton" style={{left: left, opacity: opacity}}>
                    <div className="actionIcon">
                      <img className="user-avatar" style={{height: 50, borderRadius: '50%', marginTop: 7}} src={store.userAuth.profileImageURL}/>
                    </div>
                  </div>}
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

              {/*NOTE: This input shows up after init click.*/}
              { store.isOpened ? (
                <div className="clearfix" style={{padding: '0 20px 0 20px'}}>
                  <input id="message" placeholder='crate message...' className="inputSend" style={styles.inputSend} value={store.newCrateText} onChange={this.handleChange} onKeyUp={this.handleSendCrateKeyboard}></input>
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

// TODO: reimplement this with Alec!

// const incrementGiftedCount = () => {
//   userRef.child("giftedCount").transaction(function(giftedCount) {
//     if(giftedCount === null) {
//       return 1;
//     }
//     return giftedCount + 1;
//   });
// }
//
// const updateRecentGiftees = (giftee) => {
//   userRef.child("giftees").child(giftee.uid).transaction(function(giftee) {
//     return {
//       giftedAt: Firebase.ServerValue.TIMESTAMP
//     };
//   });
// }

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
    subscribers: state.NewCrates.subscribers
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(NewCrates, dispatch)
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
