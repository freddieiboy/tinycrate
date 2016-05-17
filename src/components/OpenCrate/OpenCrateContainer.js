import React, { Component, PropTypes } from 'react';
import {bindActionCreators, store, getState} from 'redux';
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux';
import moment from 'moment';
import * as userAuth from '../../redux/modules/userAuth';
import * as NewCrates from '../../redux/modules/NewCrates';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Empty from '../Empty';
import CommentList from '../CommentList';
import { collectCrate, styleCrateHeroImage, getCrateVideo } from '../Crates/CrateUtils';
import ProfileCrateList from '../Crates/ProfileCrateList';
import AbsoluteGrid from 'react-absolute-grid';
import EXIF from 'exif-js';
import { CancelIcon, ClockIcon } from '../NewCrates/Icons';
import Hammer from 'react-hammerjs';
import { colors } from '../Crates/CrateTemplate';
import { getPswpElement, isPhoto } from '../utilities';
import { trackEvent } from '../AnalyticsUtil';

import ControlsView from './ControlsView';
import DefaultControlsView from './DefaultControlsView';
import CondensedControlsView from './CondensedControlsView';
import TextImageCrateView from './TextImageCrateView';
import DefaultCrateView from './DefaultCrateView';

var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

var unopenedCratesList = [];
var currentCrateId;

class OpenCrateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      openedCrate: {},
      contextCrate: {},
      isDefaultCrate: true
    };
  }
  componentDidMount = () => {
    console.log('OpenCrateContainer mounted')
    currentCrateId = this.props.params.crateId;
    this.loadCrateById(this.props.params.crateId);
    // this.props.actions.hideActionBar();
    setTimeout(() => {
      let width = $('#crateHeroImage > img').width();
      let height = $('#crateHeroImage > img').height();
    }, 800)
  }
  shouldComponentUpdate = (nextState, nextProps) => {
    //NOTE: getting a setState error here. Implement this effectively. Currently does nothing.
    // console.log('OpenCrateContainer should update')
    const openedCrate = this.state.openedCrate !== nextState.openedCrate;
    return openedCrate
  }
  // componentWillUpdate = () => {
  //   console.log('OpenCrateContainer is updating')
  // }
  componentWillReceiveProps = (nextProps) => {
    if(currentCrateId === nextProps.params.crateId) {
      return;
    }
    this.loadCrateById(nextProps.params.crateId);
  }
  loadCrateById = (crateId) => {
    // hide ActionBar
    this.props.actions.hideActionBar();
    // $('.actionButtons').css("visibility", "hidden");

    getCrateById(crateId, ref.getAuth().uid, crate => {
      this.setState({openedCrate: crate});
      var itself = this;
      if(crate.image) {
        var uploadAlertText = 'Loading ' + (isPhoto(crate.image) ? 'image...' : 'video...');
        notie.alert(4, uploadAlertText);
        if(isPhoto(crate.image)) {
          var image = new Image();
          image.onload = function() {
            // programatically remove the "Loading image..." alert
            $("#notie-alert-outer").click();
            var crate = itself.state.openedCrate;
            // set the crate image width and height, used by PhotoSwipe
            crate.imageWidth = image.naturalWidth;
            crate.imageHeight = image.naturalHeight;
            itself.setState({openedCrate: crate});
            let width = $('#crateHeroImage > img').width();
            let height = $('#crateHeroImage > img').height();
            styleCrateHeroImage(image, width, height);
            $("#crateHeroImage").append(image);
            // TODO: the EXIF.getData was used to rotate the image properly on desktop; disabled for now
            // EXIF.getData(image, function() {
            //   // if image has orientation data, use library to load and rotate it correctly
            //   if(EXIF.getTag(image, "Orientation")) {
            //     loadImage(
            //       crate.image,
            //       function (canvas) {
            //         // canvas loaded with base64 string of rotated image is returned by library
            //         $("#crateHeroImage").append(canvas);
            //         styleCrateHeroImage($('canvas'));
            //       },
            //       {
            //         orientation: EXIF.getTag(image, "Orientation"),
            //         crossOrigin: "anonymous"
            //       }
            //       );
            //     } else {
            //       // if there is no orientation data, append the <img> directly into the container
            //       styleCrateHeroImage(image);
            //       $("#crateHeroImage").append(image);
            //     }
            //   });
          };
          // image.crossOrigin = "anonymous";
          image.src = crate.image;
        } else {
          getCrateVideo(crate.image).then(function(video) {
            let width = $('#crateHeroImage > img').width();
            let height = $('#crateHeroImage > img').height();
            styleCrateHeroImage(video, width, height);
            video.onloadeddata = function() {
              // programatically remove the "Loading video..." alert
              $("#notie-alert-outer").click();
            };
            $("#crateHeroImage").append(video);
          });
        }
      }
      if(crate.contextCrateKey) {
        getCrateById(crate.contextCrateKey, crate.authorUId, crate => {
          itself.setState({contextCrate: crate});
        });
      }
    });

      getUnopenedCrates(this.props.store.userAuth.uid, () => {
        this.setState({data: unopenedCratesList});
      });

  }
  collectCrateButton = () => {
    if(this.state.openedCrate.type) {
      // prevent collecting notification crates
      if(this.state.openedCrate.type === "notification") {
        notie.alert(3, 'You cannot save notification crates.', 2);
        return;
      };
    }
    trackEvent("Save Crate Button");
    collectCrate(this.props.store, this.state.openedCrate);
  }
  viewSenderProfile = () => {
    getUserByUid(this.state.openedCrate.authorUId, (user) => {
      setTimeout(() => {
        trackEvent("Open Crate Profile Button", {
          "username": user.username
        });
        this.props.actions.push("/user/" + user.username);
      }, 700)
    });
  }
  // returns the image object injected by loadImage which is either in a <img> or canvas
  getCrateImage = () => {
    return new Promise(function(resolve, reject) {
      var crateHeroImage = $("#crateHeroImage").children();
      if(crateHeroImage.is("canvas")) {
        var image = new Image();
        // get base64 string of rotated image inside canvas
        image.src = crateHeroImage[0].toDataURL('image/jpeg', 0.5);
        image.onload = function() {
          resolve(image);
        };
      } else {
        // return normal <img> object
        resolve(crateHeroImage[0]);
      }
    });
  }
  viewPhoto = () => {
    var itself = this;

    getPswpElement(function(pswpElement) {
      if(isPhoto(itself.state.openedCrate.image)) {
        return itself.getCrateImage().then(function(image) {
          var slides = [
            {
              src: image.src,
              msrc: image.src,
              w: image.naturalWidth,
              h: image.naturalHeight
            }
          ];

          var options = {
            closeOnScroll: false,
            shareEl: false
          };

          var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
          gallery.init();
        });
      } else {
        return getCrateVideo(itself.state.openedCrate.image).then(function(video) {
          let width = $('#crateHeroImage > img').width();
          let height = $('#crateHeroImage > img').height();
          styleCrateHeroImage(video, width, height)
          var slides = [
            {
              html: video,
            }
          ];

          var options = {
            closeOnScroll: false,
            shareEl: false
          };

          var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
          gallery.init();
        });
      }
    });
  }
  regiftCrate = () => {
    // trackEvent("Regift Crate Button");
    // this.props.actions.selectCrateColor(this.state.openedCrate.crateColor);
    // this.props.actions.addRegiftCrateText(this.state.openedCrate.text);
    // this.props.actions.addNewCratePhoto((this.state.openedCrate.image) ? this.state.openedCrate.image : '');
    // $("#imagePreview").attr('src', this.props.store.newCratePhoto);
    //
    // this.props.actions.push('new-crate');
    // console.log('regiftcrate funtion is running')
    notie.alert(3, 'There is a bug, disabled for now!', 2);
  }
  onOpen = (crateId) => {
    var oldCrates = this.state.data;
    // locally removes the crate by filtering it out by its id
    var newCrates = oldCrates.filter(function(crate) {
      return crate.key != crateId;
    });
    this.setState({data: newCrates});
    this.props.actions.push("/crate/" + crateId);
  }
  closePreview = () => {
    trackEvent("Close Open Crate Button");
    this.props.actions.push("/");
  }
  render() {

    var emptyState;
    if (this.state.data.length == 0) {
      emptyState = <Empty />;
    } else {
      emptyState = '';
    }

    var timestamp = moment(this.state.openedCrate.createdAt).fromNow();

    //NOTE: this is hacky. The color state is updated async. That one second delay doesn't allow ControlsView to the color quick enough. I added 'empty' as a default. Looks and feels like it's glitchy.
    const crateColor = this.state.openedCrate.crateColor;
    let currentCrateColor;
    let crateOwnerImage;

    if (crateColor === undefined) {
      currentCrateColor = 'empty'
      crateOwnerImage = ''
    } else {
      currentCrateColor = this.state.openedCrate.crateColor
      crateOwnerImage = this.state.openedCrate.authorProfileImageURL
    }

    const styles = {
      OpenCrateContainer: {
        // position: 'absolute',
        // top: '0px',
        // left: '0px',
        // height: '100vh',
        height: '100%',
        // width: '100%',
        // backgroundColor: '#000'
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      },
      TextImageCrateView: {
        flex: '1',
        backgroundColor: 'snow',
        position: 'relative'
      },
      test: {

      },
      CondensedControlsView: {
        flex: '0 auto',
        alignItem: 'flex-end',
        zIndex: '0'
      }
    }
    return (
      <div className="profile-page-holder" style={styles.OpenCrateContainer}>
        <div className="TextImageCrateView" style={styles.TextImageCrateView}>
          {/*<TextImageCrateView
            openedCrate={this.state.openedCrate}
            currentCrateColor={currentCrateColor}
            closePreview={this.closePreview}
            viewPhoto={this.viewPhoto}
            timestamp={timestamp}
            />*/}
            <DefaultCrateView
              openedCrate={this.state.openedCrate}
              contextCrate={this.state.contextCrate}
              currentCrateColor={currentCrateColor}
              viewPhoto={this.viewPhoto}
              timestamp={timestamp}
              isDefaultCrate={this.state.isDefaultCrate}
              closePreview={this.closePreview}
              />
        </div>
        <div className="CondensedControlsView" style={styles.CondensedControlsView}>
          {this.state.isDefaultCrate ?
            <DefaultControlsView
              thisCrateColor={currentCrateColor}
              userImage={crateOwnerImage}
              author={this.state.openedCrate.authorDisplayName}
              viewSenderProfile={this.viewSenderProfile}
              saveToProfile={this.collectCrateButton}
              closePreview={this.closePreview}
              openedCrate={this.state.openedCrate}
              />
          :
            <CondensedControlsView
              thisCrateColor={currentCrateColor}
              userImage={crateOwnerImage}
              author={this.state.openedCrate.authorDisplayName}
              viewSenderProfile={this.viewSenderProfile}
              saveToProfile={this.collectCrateButton}
              closePreview={this.closePreview}
              />
          }
        </div>
        {/*<div className="controlsView" style={styles.controlsView}>
          <ControlsView
          userColor={currentCrateColor}
          crateContentsSaved={false}
          regift={this.regiftCrate}
          saveToProfile={this.collectCrateButton}
          viewSenderProfile={this.viewSenderProfile}
          userImage={crateOwnerImage}/>
        </div>*/}
        {/*<div style={{padding: '22px', top: '386px'}} className="container-fluid body-content">
          <AbsoluteGrid items={this.state.data} displayObject={(<ProfileCrateList onOpen={this.onOpen} />)} responsive={true} itemHeight={100} itemWidth={92} />
          {emptyState}
        </div>*/}
    </div>
    );
  }
}

function getUserByUid (uid, callback) {
  ref.child('users').child(uid).once('value', (snap) => {
    var user = snap.val();
    user.key = uid;
    callback(user);
  });
}

function getCrateById(id, uid, callback) {
  ref.child('crateFeed').child(uid).child(id).once('value', (snap) => {
    var crate = snap.val();
    crate.key = id;
    callback(crate);
  });
}

function getUnopenedCrates(uid, callback) {
  var unopenedCratesRef = ref.child('crateFeed').child(ref.getAuth().uid);
  unopenedCratesList = [];
  unopenedCratesRef.orderByChild("opened").equalTo(false).on("child_added", (snapshot) => {
    var crate = snapshot.val();
    crate.key = snapshot.key();
    crate.profileImageURL = crate.authorProfileImageURL;
    unopenedCratesList.push(crate);
    callback();
  })
}

const mapStateToProps = (state) => ({
  store: {
    userAuth: state.userAuth
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, NewCrates, userAuth, routerActions), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(OpenCrateContainer)
