import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as crateActions from '../../redux/modules/crates';
import {pop1, pop2, openCrate} from './CrateUtils';
import Hammer from 'react-hammerjs';
import {ifStyle} from '../utilities';
import {EmojiContainer, CrateEmojis} from '../Emojis';
import {FacebookIcon, TwitterIcon, TextIcon, SettingsIcon, MuteIcon, PlayIcon, FollowIcon, LogoutIcon} from  '../NewCrates/Icons';
import $ from 'jquery';
var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

// <CrateTemplate color={'empty'} crateSize={80} cratePreview={Emojis[store.emoji]} pop={true} crateType={'normal'} shadow={'true'}/>

class CrateTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPressed: false,
      isDeleted: false
    }
  }
  pressCrate = () => {
    this.setState({isPressed: true});
  }
  setupPop = (event) => {
    const {
      popType,
      crateType,
      onOpen,
      id,
      username
    } = this.props;
    const { isPressed } = this.state;
    if (isPressed && popType === '1') {
      if (crateType === 'normal') {
        this.pop1(true);
      } else if (crateType === 'profile') {
        console.log('this is called')
        this.pop1();
        if(username) {
          setTimeout(() => {
            onOpen(username);
            console.log('onOpened called')
          }, 700)
        }
      } else {
        this.pop1();
      }
    } else if (isPressed && popType === '2') {
      this.pop2();
    }
  }
  pop1 = (willDelete = false) => {
    pop1(this.refs.popContainer, eval(this.props.color), this.refs.thisCratePreview);
    if (willDelete === true) {
      this.setState({isDeleted: true})
      this.deleteObj(event);
    } else {
      this.setState({isPressed: false});
    }
  }
  pop2 = (willDelete = false) => {
    pop2(this.refs.popContainer, eval(this.props.color), this.refs.thisCratePreview);
    if (willDelete === true) {
      this.setState({isDeleted: true})
      this.deleteObj(event);
    } else {
      this.setState({isPressed: false});
    }
  }
  deleteObj = (event) => {
    var crate = ref.child('crateFeed').child(ref.getAuth().uid).child(this.props.id);
    openCrate(crate, () => {
      setTimeout(() => {
        this.props.onDelete(this.props.id);
      }, 700);
    });
    event.preventDefault();
  }
  render() {
    let {
      crateSize,
      color,
      cratePreview,
      crateType
    } = this.props;
    const styles = {
      CrateTemplate: {
        position: 'relative',
        height: crateSize,
        width: crateSize
      },
      popContainer: {
        height: '100%',
        width: '100%'
      },
      imageAndCrate: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: '0px'
      },
      crateSize: {
        width: crateSize,
      },
      crateImage: {
        marginTop: '-' + crateSize/6 + 'px',
        zIndex: '10',
        height: crateSize/1.7,
        width: crateSize/1.7,
        borderRadius: '50%',
        overflow: 'hidden',
        zIndex: '1',
        // backgroundColor: eval(color).darkColor,
      },
      crateImagePressed: {
        marginTop: crateSize/9 + 'px',
        transform: 'scale(1, .8) translate(-50%, -50%)',
      },
      cratePreview: {
        height: crateSize/1.7,
        padding: '0px',
        border: '0px',
        margin: '0px',
        transform: 'scale(2)',
        opacity: '.5',
        WebkitFilter: 'blur(1.5px)',
        filter: 'blur(1.5px)',
      },
      profileImage: {
        height: crateSize/4,
        padding: '0px',
        border: '0px',
        margin: '0px',
        borderRadius: '50%',
        position: 'absolute',
        bottom: '-' + crateSize/10 + 'px',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      },
      profileImagePressed: {
        bottom: '-' + crateSize/4 + 'px',
        transform: 'scale(1, .5) translate(-50%, -50%)',
      },
      cratePreviewProfile: {
        height: crateSize/1.7,
        padding: '0px',
        border: '0px',
        margin: '0px',
      },
      shadow: {
        height: crateSize/1.5,
        borderRadius: crateSize/5,
      	boxShadow: this.props.shadow === 'true' ? '0px 12px 10px 0px rgba(5,156,150,0.34)' : 'none',
        position: 'absolute',
        width: '100%',
        top: '31%',
        zIndex: -1
      },
      shadowPressed: {
        height: crateSize/2.1,
        borderRadius: '50%',
      	boxShadow: this.props.shadow === 'true' ? '0px 11px 10px 0px rgba(5,156,150,0.34)' : 'none',
        position: 'absolute',
        width: '100%',
        top: '50%',
        zIndex: -1
      },
      pressedMargin: {
        marginTop: crateSize/3
      },
      center: {
        textAlign: 'center'
      },
      hide: {
        visibility: 'hidden'
      },
      textIcon: {
        transform: 'scale(1.5)',
        marginTop: '17px'
      },
      emojiContainer: {
        transform: 'scale(.8)'
        // border: '1px solid red'
      },
      crateIcon: {
        transform: 'scale(1.2)',
        marginTop: '8px'
      },
      socialIcon: {
        transform: 'scale(1.2)',
        marginTop: '4px'
      }
    }
    var preview;
    var profileImage;
    if (crateType === 'empty') {
      preview = <div className="emojiContainer" style={styles.emojiContainer}>{EmojiContainer[this.props.store.emoji]}</div>
    } else if (crateType === 'login-twitter') {
      preview = <div className="socialIcon" style={styles.socialIcon}><TwitterIcon /></div>
      profileImage = null;
    } else if (crateType === 'login-facebook') {
      preview = <div className="socialIcon" style={styles.socialIcon}><FacebookIcon /></div>
      profileImage = null;
    } else if (crateType === 'tutorial') {
      preview = <div className="emojiContainer" style={styles.emojiContainer}><CrateEmojis color={eval(color).darkColor} visible={'1'}/></div>
      profileImage = null;
    } else if (crateType === 'profile') {
      preview = <img className="userImage noTouch" src={this.props.cratePreview} style={styles.cratePreviewProfile} align="middle"></img>
      profileImage = null;
    } else if (crateType === 'normal') {
      if (this.props.cratePreview === undefined) {
        preview = <div className="textIcon" style={styles.textIcon}>
            <TextIcon color={eval(color).darkColor}/>
        </div>
        profileImage = <img className="userImage noTouch" src={this.props.crateOwnerImage} style={ifStyle(
            styles.profileImage,
            this.state.isPressed && styles.profileImagePressed
          )} align="middle"></img>
      } else {
        preview = <img className="userImage noTouch" src={this.props.cratePreview} style={styles.cratePreview} align="middle"></img>
        profileImage = <img className="userImage noTouch" src={this.props.crateOwnerImage} style={ifStyle(
            styles.profileImage,
            this.state.isPressed && styles.profileImagePressed
          )} align="middle"></img>
      }
    } else if (crateType === 'settings') {
      preview = <div className="crateIcon" style={styles.crateIcon}><SettingsIcon color={colors(color).darkColor} /></div>
      profileImage = null;
    } else if (crateType === 'settings-block') {
      preview = <div className="crateIcon" style={styles.crateIcon}><MuteIcon color={colors(color).darkColor} /></div>
      profileImage = null;
    } else if (crateType === 'settings-unblock') {
      preview = <div className="crateIcon" style={styles.crateIcon}><PlayIcon color={colors(color).darkColor} /></div>
      profileImage = null;
    } else if (crateType === 'settings-follow') {
      preview = <div className="crateIcon" style={styles.crateIcon}><FollowIcon color={colors(color).darkColor} /></div>
      profileImage = null;
    } else if (crateType === 'settings-logout') {
      preview = <div className="crateIcon" style={styles.crateIcon}><LogoutIcon color={colors(color).darkColor} /></div>
      profileImage = null;
    }
    return (
      <div className="CrateTemplate" style={styles.CrateTemplate}>
        <div className="popContainer noTouch" ref="popContainer" style={styles.popContainer}></div>
        <div className="imageAndCrate" style={ifStyle(
            styles.imageAndCrate,
            this.state.isDeleted && styles.hide
          )}>
          {profileImage}
          <div className="crateImage noTouch center" style={ifStyle(
              styles.crateImage,
              this.state.isPressed && styles.crateImagePressed,
            )} ref="thisEmptyImage">
            <div className="cratePreview" ref="thisCratePreview" style={styles.center}>
              {preview}
            </div>
          </div>
          <div style={styles.crateSize}
            className="thisEmptyCrate"
            onMouseDown={this.pressCrate}
            onMouseUp={this.setupPop}
            onTouchStart={this.pressCrate}
            onTouchEnd={this.setupPop}>
            <div className="noTouch">
              { this.state.isPressed ? (
                <div className="crate1">
                  <svg viewBox="0 0 156 128" version="1.1" style={styles.pressedMargin}>
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <path id="crate-bottom-pressed" fill={eval(color).darkColor} d="M0.0387363138,53.1420234 C0.0387363138,33.0095093 4.40172453,23.7783713 4.40172453,23.7783713 C8.3778203,9.54136997 22.420139,3.1744319 35.8499801,9.33898447 C35.8499801,9.33898447 65.5461533,24.5105362 78.306673,24.5105362 C92.7046443,24.5105362 122.360906,9.28610109 122.360906,9.28610109 C135.76712,3.05295957 149.523301,9.63873233 152.692555,24.0832809 C152.692555,24.0832809 156.57461,35.2669851 156.574609,53.1420234 C156.574607,71.0170617 154.896172,90.5357711 154.896172,90.5357711 C153.873561,105.286307 141.319279,119.781221 126.806179,122.523472 C126.806179,122.523472 109.207247,127.643024 78.306673,127.643024 C47.4060993,127.643024 29.5884618,122.504433 29.5884618,122.504433 C15.0956454,119.599165 2.50140433,105.279136 1.55847323,90.5253465 C1.55847323,90.5253465 0.0387363138,73.2745376 0.0387363138,53.1420234 Z"></path>
                      <path id="crate-top-pressed" fill={eval(color).lightColor} d="M4.7744506,46.1259538 C4.7744506,39.0444277 5.96801792,24.8770004 5.96801792,24.8770004 C7.04101595,10.1321596 19.8689786,-0.901461016 34.6155842,0.179360544 C34.6155842,0.179360544 63.691099,2.60355121 78.1957364,2.60355121 C92.7003738,2.60355121 121.798558,0.177746943 121.798558,0.177746943 C136.534654,-0.926072811 149.657527,10.1009533 150.981888,24.8428406 C150.981888,24.8428406 152.274144,34.7384112 152.274144,46.1259534 C152.274144,57.5134956 150.979238,67.4430821 150.979238,67.4430821 C149.59929,82.1540258 136.650418,96.0498289 122.02826,98.1680952 C122.02826,98.1680952 106.576587,101.73023 78.1957385,101.730231 C49.8148903,101.730232 34.3632146,98.1680957 34.3632146,98.1680957 C19.7539785,95.910083 6.89580173,82.1363981 5.78409212,67.3988071 C5.78409212,67.3988071 4.7744506,59.4351654 4.7744506,46.1259538 Z"></path>
                    </g>
                  </svg>
                  <div className="shadow" style={styles.shadowPressed}></div>
                </div>
              ) : (
                <div className="crate0">
                  <svg viewBox="0 0 157 164" version="1.1">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <rect id="crate-bottom" fill={eval(color).darkColor} x="0" y="36.2828685" width="157" height="126.717131" rx="26"></rect>
                      <rect id="crate-top" fill={eval(color).lightColor} x="0" y="0" width="157" height="107.641434" rx="26"></rect>
                    </g>
                  </svg>
                  <div className="shadow" style={styles.shadow}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const green = {
  lightColor: '#49FFCC',
  darkColor: '#1ADEDB',
}
const yellow = {
  lightColor: '#FCE973',
  darkColor: '#FFC868',
}
const orange = {
  lightColor: '#FD9C44',
  darkColor: '#F67A1B',
}
const blue = {
  lightColor: '#57E3FD',
  darkColor: '#2BBFD9',
}
const pink = {
  lightColor: '#FB70AF',
  darkColor: '#EE3B76',
}
const purple = {
  lightColor: '#FF5DFA',
  darkColor: '#C746E9',
}
const empty = {
  lightColor: '#E9FAFD',
  darkColor: '#CBEBF0'
}
const emptyAlt = {
  lightColor: '#CBEBF0'
}
const productHunt = {
  lightColor: '#DA552F',
  darkColor: '#CC4124'
}
const twitter = {
  lightColor: '#55ACEE',
  darkColor: '#2F91DB'
}
const facebook = {
  lightColor: '#3B5998',
  darkColor: '#24468B'
}

export const colors = (color) => {
  switch(eval(color)) {
    case green:
      return {
        lightColor: '#49FFCC',
        darkColor: '#1ADEDB',
      }
    case yellow:
      return {
        lightColor: '#FCE973',
        darkColor: '#FFC868',
      }
    case orange:
      return {
        lightColor: '#FD9C44',
        darkColor: '#F67A1B',
      }
    case blue:
      return {
        lightColor: '#57E3FD',
        darkColor: '#2BBFD9',
      }
    case pink:
      return {
        lightColor: '#FB70AF',
        darkColor: '#EE3B76',
      }
    case purple:
      return {
        lightColor: '#FF5DFA',
        darkColor: '#C746E9',
      }
    case empty:
      return {
        lightColor: '#E9FAFD',
        darkColor: '#CBEBF0'
      }
    case productHunt:
      return {
        lightColor: '#DA552F',
        darkColor: '#CC4124'
      }
    case twitter:
      return {
        lightColor: '#55ACEE',
        darkColor: '#2F91DB'
      }
    case facebook:
      return {
        lightColor: '#3B5998',
        darkColor: '#24468B'
      }
  }
}

const mapStateToProps = (state, ownProps) => ({
  store: {
    emoji: state.crates.emoji
  }
})

export default connect(mapStateToProps)(CrateTemplate)
