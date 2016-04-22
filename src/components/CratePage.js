import React, { Component, PropTypes } from 'react';
import {bindActionCreators, store, getState} from 'redux';
import {push} from 'react-router-redux';
import { connect } from 'react-redux';
import moment from 'moment';
import * as userAuth from '../redux/modules/userAuth';
import * as NewCrates from '../redux/modules/NewCrates';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Empty from './Empty';
import CommentList from './CommentList';
import { collectCrate } from './Crates/CrateUtils';
import ProfileCrateList from './Crates/ProfileCrateList';
import ProfileCrate from './Crates/ProfileCrate';
import AbsoluteGrid from 'react-absolute-grid';
import EXIF from 'exif-js';
import PhotoTilt from '../photoTilt.js'

var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

var unopenedCratesList = [];
var currentCrateId;

class CratePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      openedCrate: {}
    };
  }
  loadCrateById = (crateId) => {
    // hide ActionBar
    $('.actionButtons').css("visibility", "hidden");
    
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
  componentWillReceiveProps = (nextProps) => {
    if(currentCrateId === nextProps.params.crateId) {
      return;
    }
    this.loadCrateById(nextProps.params.crateId);
  }
  componentDidMount = () => {
    currentCrateId = this.props.params.crateId;
    this.loadCrateById(this.props.params.crateId);
  }
  collectCrateButton = () => {
    collectCrate(this.state.openedCrate);
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
    this.props.actions.addNewCrateText(this.state.openedCrate.text);
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
  render() {

    var emptyState;
    if (this.state.data.length == 0) {
      emptyState = <Empty />;
    } else {
      emptyState = '';
    }
    
    var crateHeroContent;
    if (this.state.openedCrate.image) {
      crateHeroContent = <div id="crateHeroImage" onClick={this.viewPhoto} />;
    } else {
      crateHeroContent = <p style={{maxWidth: '100%', fontSize: '20px', textAlign: 'center', padding: '10px', position:'relative', top: '50%', transform: 'translateY(-50%)'}}>{this.state.openedCrate.text}</p>;
    }

    var timestamp = moment(this.state.openedCrate.createdAt).fromNow();

    return (
    <div className="profile-page-holder">

      <div className="cratePageImage">
      <div className="Grid Grid--gutters u-textCenter" style={{height: '70%'}}>
        <div className="Grid-cell" style={{height: '100%'}}>
          {crateHeroContent}
        </div>
      </div>
      <div className="Grid Grid--gutters u-textCenter cratePageInfo" style={{height: '30%'}}>
        <div className="Grid-cell">
          <div onClick={this.collectCrateButton}><span style={{cursor: 'pointer'}}>Save</span></div>
        </div>
        <div className="Grid-cell user-info-holder">
          <div>{this.state.openedCrate.authorDisplayName}</div>
          {this.state.openedCrate.image ?
            <div>{this.state.openedCrate.text}</div>
            : ''
          }
          <div style={{color: "#949aa0"}}> {timestamp}</div>
        </div>
        <div className="Grid-cell">
          <div onClick={this.regiftCrate}><span style={{cursor: 'pointer'}}>Regift</span></div>
        </div>
      </div>
      </div>
      
      <div style={{padding: '22px', top: '386px'}} className="container-fluid body-content">
        <AbsoluteGrid items={this.state.data} displayObject={(<ProfileCrateList onOpen={this.onOpen} />)} responsive={true} itemHeight={100} itemWidth={92} />
        {emptyState}
      </div>

    </div>
    );
  }
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
  $(image).css('maxWidth', '100%');
  $(image).css('maxHeight', '265px');
  $(image).css('display', 'block');
  $(image).css('marginRight', 'auto');
  $(image).css('marginLeft', 'auto');
  $(image).css('cursor', 'pointer')
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

export default connect(mapStateToProps, mapDispatchToProps)(CratePage)
