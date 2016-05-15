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
import { collectCrate } from '../Crates/CrateUtils';
import ProfileCrateList from '../Crates/ProfileCrateList';
import AbsoluteGrid from 'react-absolute-grid';
import EXIF from 'exif-js';
import { CancelIcon, ClockIcon } from '../NewCrates/Icons';
import Hammer from 'react-hammerjs';
import { colors } from '../Crates/CrateTemplate';
import { getPswpElement } from '../utilities';
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

    getCrateById(crateId, crate => {
      this.setState({openedCrate: crate});
      var itself = this;
      var image = new Image();
      image.onload = function() {
        var crate = itself.state.openedCrate;
        // set the crate image width and height, used by PhotoSwipe
        crate.imageWidth = this.width;
        crate.imageHeight = this.height;
        itself.setState({openedCrate: crate});
        EXIF.getData(image, function() {
          // if image has orientation data, use library to load and rotate it correctly
          if(EXIF.getTag(image, "Orientation")) {
            loadImage(
              crate.image,
              function (canvas) {
                // canvas loaded with base64 string of rotated image is returned by library
                $("#crateHeroImage").append(canvas);
                styleCrateHeroImage($('canvas'));
              },
              {
                orientation: EXIF.getTag(image, "Orientation")}
              );
            } else {
              // if there is no orientation data, append the <img> directly into the container
              styleCrateHeroImage(image);
              $("#crateHeroImage").append(image);
            }
          });
        };
        image.crossOrigin = "anonymous";
        image.src = crate.image;
      });

      getUnopenedCrates(this.props.store.userAuth.uid, () => {
        this.setState({data: unopenedCratesList});
      });

  }
  collectCrateButton = () => {
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
  viewPhoto = () => {
    var itself = this;

    getPswpElement(function(pswpElement) {
      var slides = [
        {
          src: itself.state.openedCrate.image,
          msrc: itself.state.openedCrate.image,
          w: itself.state.openedCrate.imageWidth,
          h: itself.state.openedCrate.imageHeight
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
              regift={this.regiftCrate}
              closePreview={this.closePreview}
              />
          :
            <CondensedControlsView
              thisCrateColor={currentCrateColor}
              userImage={crateOwnerImage}
              author={this.state.openedCrate.authorDisplayName}
              viewSenderProfile={this.viewSenderProfile}
              saveToProfile={this.collectCrateButton}
              regift={this.regiftCrate}
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

function getCrateById(id, callback) {
  ref.child('crateFeed').child(ref.getAuth().uid).child(id).once('value', (snap) => {
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

function styleCrateHeroImage(image) {
  setTimeout(() => {
    let width = $('#crateHeroImage > img').width();
    let height = $('#crateHeroImage > img').height();
    console.log(width, height, width > height)

    if (width > height) {
      $(image).css('width', '100%');
      $(image).css('height', 'auto');
      $(image).css('left', '0px');
      $(image).css('top', '50%');
      $(image).css('transform', 'translate(0, -50%)');
    } else {
      $(image).css('width', 'auto');
      $(image).css('height', '100%');
      $(image).css('left', '50%');
      $(image).css('top', '0px');
      $(image).css('transform', 'translate(-50%, 0)');
    }
    $(image).css('position', 'absolute');
    $(image).css('margin', '0px');
    $(image).css('padding', '0px');
    $(image).css('border', '0px');
    $(image).css('bottom', '0px');
  }, 1)
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
