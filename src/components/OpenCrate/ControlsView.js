import React from 'react';
import CrateTemplate, { colors } from '../Crates/CrateTemplate';
import { ifStyle } from '../utilities';
import { NextIcon, RegiftIcon, StarIcon } from '../NewCrates/Icons';
import Hammer from 'react-hammerjs';

const ControlsView = ({userImage, saveToProfile, regift, viewSenderProfile, userColor, crateContentsSaved}) => {
  const styles = {
    ControlsView: {
      height: '100%',
      overflow: 'hidden'
    },
    buttonBG: {
      height: '80px',
      width: '80px',
      borderRadius: '50%',
      backgroundColor: '#1E1E1E',
      left: '50%',
      position: 'absolute',
      marginLeft: '-40px',
      marginTop: '-40px',
      border: '2px solid' + colors(userColor).lightColor
    },
    cell: {
      position: 'relative',
    },
    crateCell: {
      position: 'relative',
      height: '100%',
    },
    hide: {
      display: 'none'
    },
    subdue: {
      opacity: '.4'
    },
    buttonIcon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    starIcon: {
      transform: 'rotateY(180deg)',
      marginTop: '4px',
      marginLeft: '-3px',
    },
    nextIcon: {
      marginTop: '10px',
      marginLeft: '3px'
    },
    regiftIcon: {
      transform: 'rotate(90deg)',
      marginLeft: '-8px'
    },
    noTouch: {
      pointerEvents: 'none'
    },
    firstCrate: {
      margin: '320px 0 20px',
      width: '80px'
    },
    individualCrate: {
      marginBottom: '15px',
      width: '80px'
    }
  }
  let saved;
  crateContentsSaved ? saved = userColor : saved = 'none'
  return (
    <div className="ControlsView"  style={styles.ControlsView}>
      <div className="Grid Grid--center" style={{height: '100%'}}>

        <div className="Grid-cell" style={styles.cell}>
          <Hammer onTap={saveToProfile}>
            <div className="buttonBG" style={styles.buttonBG}>
              <div className="buttonIcon" style={styles.buttonIcon}>
                <div className="icon" style={styles.starIcon}>
                  <StarIcon color={colors(userColor).lightColor} fill={saved} />
                </div>
              </div>
            </div>
          </Hammer>
        </div>

        <div className="Grid-cell" style={styles.crateCell}>
          <div onTouchEnd={viewSenderProfile}>
            <div className="buttonBG">
              <div className="buttonIcon" style={styles.buttonIcon}>
                <div className="userImage" style={styles.userImage}>
                  <div className="center">
                    <CrateTemplate crateSize={80} color={colors(userColor)} cratePreview={userImage} crateType={'profile'} popType={'1'} pop={'true'} shadow={'false'}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="Grid-cell" style={styles.cell}>
          <Hammer onTap={regift}>
            <div className="buttonBG" style={styles.buttonBG}>
              <div className="buttonIcon" style={styles.buttonIcon}>
                <div className="icon" style={styles.regiftIcon}>
                  <RegiftIcon color={colors(userColor).lightColor} />
                </div>
              </div>
            </div>
          </Hammer>
        </div>
      </div>
    </div>
  )
}

export default ControlsView;
