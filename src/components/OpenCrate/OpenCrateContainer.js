import React, { Component, PropTypes } from 'react';
import {bindActionCreators, store, getState} from 'redux';
import {push} from 'react-router-redux';
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
import PhotoTilt from '../../photoTilt.js'
import { CancelIcon, ClockIcon } from '../NewCrates/Icons';
import Hammer from 'react-hammerjs';
import { colors } from '../Crates/CrateTemplate';

import ControlsView from './ControlsView';
import CondensedControlsView from './CondensedControlsView';
import TextImageCrateView from './TextImageCrateView';

var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

var unopenedCratesList = [];
var currentCrateId;

class OpenCrateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      openedCrate: {}
    };
  }
  componentDidMount = () => {
    console.log('OpenCrateContainer mounted')
    currentCrateId = this.props.params.crateId;
    this.loadCrateById(this.props.params.crateId);
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
  componentWillUnmount = () => {
    // remove the PhotoTilt mask if component unmounts before the user closes the mask
    $(".mask").remove();
  }
  loadCrateById = (crateId) => {
    // hide ActionBar
    this.props.actions.hideActionBar();
    // $('.actionButtons').css("visibility", "hidden");

    getCrateById(crateId, crate => {
      this.setState({openedCrate: crate});

      var image = new Image();
      image.onload = function() {
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
        image.src = crate.image;
      });

      getUnopenedCrates(this.props.store.userAuth.uid, () => {
        this.setState({data: unopenedCratesList});
      });

  }
  collectCrateButton = () => {
    collectCrate(this.props.store, this.state.openedCrate);
  }
  viewSenderProfile = () => {
    getUserByUid(this.state.openedCrate.authorUId, (user) => {
      setTimeout(() => {
        this.props.dispatch(push("/user/" + user.username));
      }, 700)
    });
  }
  viewPhoto = () => {
    var photoTilt = new PhotoTilt({
      url: this.state.openedCrate.image
    });
    setTimeout(function(){
      $(".mask").click(function() {
        $(".mask").remove();
      });
    }, 500);
  }
  regiftCrate = () => {
    $('.actionButtons').css("visibility", "visible");
    this.props.actions.openActionBar();
    this.props.actions.selectCrateColor(this.state.openedCrate.crateColor);
    this.props.actions.addRegiftCrateText(this.state.openedCrate.text);
    this.props.actions.addNewCratePhoto((this.state.openedCrate.image) ? this.state.openedCrate.image : '');
    $("#imagePreview").attr('src', this.props.store.newCratePhoto);
  }
  onOpen = (crateId) => {
    var oldCrates = this.state.data;
    // locally removes the crate by filtering it out by its id
    var newCrates = oldCrates.filter(function(crate) {
      return crate.key != crateId;
    });
    this.setState({data: newCrates});
    this.props.dispatch(push("/crate/" + crateId));
  }
  closePreview = () => {
    this.props.dispatch(push("/"));
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
        backgroundColor: 'honeydew'
      },
      test: {

      },
      CondensedControlsView: {
        flex: '0 auto',
        alignItem: 'flex-end'
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
        </div>
        <div className="CondensedControlsView" style={styles.CondensedControlsView}>
          <CondensedControlsView
            thisCrateColor={currentCrateColor}
            author={this.state.openedCrate.authorDisplayName}
            />
        </div>
        {/*<div className="controlsView" style={styles.controlsView}>
          <ControlsView userColor={currentCrateColor} crateContentsSaved={false} regift={this.regiftCrate} saveToProfile={this.collectCrateButton} viewSenderProfile={this.viewSenderProfile} userImage={crateOwnerImage}/>
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
  actions: bindActionCreators(Object.assign({}, NewCrates, userAuth), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(OpenCrateContainer)
