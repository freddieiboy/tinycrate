import React from 'react';
import { StarIcon, RegiftIcon, CancelIcon } from '../NewCrates/Icons';
import FlexCrateTemplate, { colors } from '../Crates/FlexCrateTemplate';
import { ifStyle } from '../utilities';
import Hammer from 'react-hammerjs';
import ReactionCrateList from './ReactionCrateList';

const DefaultControlsView = ({
  userImage,
  saveToProfile,
  regift,
  viewSenderProfile,
  thisCrateColor,
  crateContentsSaved,
  author,
  closePreview,
  openedCrate
}) => {
  const styles = {
    DefaultControlsView: {
      display: 'flex',
      textAlign: 'center',
      height: '100px',
      backgroundColor: '#000',
      // boxShadow: '0px -3px 12px 0px rgba(126,126,126,0.38)'
    },
    controlBox: {
      flex: '1',
      // border: '1px solid white',
      height: '100%',
      // borderLeft: '1px solid #E4E4E4',
    },
    controlContents: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      position: 'relative'
    },
    crateControlContents: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      height: '100%',
    },
    author: {
      margin: '0 0 0 10px'
    },
    // crate: {
    //   flex: '0 50%'
    // },
    regiftIcon:  {
      // transform: 'rotate(90deg)',
      // marginLeft: '-5px'
    },
    cancel: {
      marginTop: '1px'
    },
    regift: {

    },
    cancelBG: {
      height: '50px',
      width: '50px',
      borderRadius: '50%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: '0px 2px 3px 0px rgba(0,0,0,0.2)'
    },
  }
  const color = colors(thisCrateColor).lightColor;
  return (
    <div className="DefaultControlsView" style={styles.DefaultControlsView}>
      <div className="saveContainer" style={styles.controlBox}>
        <Hammer onTap={saveToProfile}>
          <div className="controlContents" style={styles.controlContents}>
            <StarIcon color={color} />
          </div>
        </Hammer>
      </div>
      <div className="crateContainer" style={styles.controlBox}>
        <div className="controlContents" style={styles.crateControlContents}>
          <div onTouchEnd={viewSenderProfile}>
            <FlexCrateTemplate
              color={thisCrateColor}
              size={60}
              type={'profile'}
              preview={userImage}
              pop={1}
              shadow={true}
              />
          </div>
        </div>
      </div>
      <div className="regiftContainer" style={styles.controlBox}>
        <div className="controlContents" style={styles.controlContents}>
          <div className="regiftIcon full-container" style={styles.regiftIcon}>
            {/*<RegiftIcon color={color} />*/}
            <ReactionCrateList color={color} openedCrate={openedCrate}/>
          </div>
        </div>
      </div>
      {/*<div className="closeContainer" style={styles.controlBox}>
        <Hammer onTap={closePreview}>
          <div className="controlContents" style={styles.controlContents}>
            <div className="cancelBG" style={styles.cancelBG}></div>
            <div className="cancel" style={styles.cancel}>
              <CancelIcon color={color} />
            </div>
          </div>
        </Hammer>
      </div>*/}
    </div>
  )
}

export default DefaultControlsView;
