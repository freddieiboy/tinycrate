import React from 'react';
import { colors } from '../Crates/CrateTemplate';
import { ifStyle } from '../utilities';
import { NextIcon } from '../NewCrates/Icons';
import Hammer from 'react-hammerjs';

const ControlsView = ({userImage, slide, back, next, selectedColor, finish, isSelectingColor}) => {
  const styles = {
    ControlsView: {
      height: '100%'
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
      border: '2px solid' + colors(selectedColor).lightColor
    },
    cell: {
      position: 'relative'
    },
    hide: {
      visibility: 'hidden'
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
    userImage: {
      height: '120px',
      width: '120px',
      borderRadius: '50%',
      border: '5px solid' + colors(selectedColor).lightColor,
      backgroundColor: colors(selectedColor).lightColor
    },
    backIcon: {
      transform: 'rotateY(180deg)',
      marginTop: '10px',
      marginLeft: '-3px',
    },
    nextIcon: {
      marginTop: '10px',
      marginLeft: '3px'
    },
    noTouch: {
      pointerEvents: 'none',
      opacity: 0
    }
  }
  let nextAction;
  slide === 5 ? nextAction = finish : nextAction = next
  return (
    <div className="ControlsView"  style={styles.ControlsView}>
      <div className="Grid Grid--center" style={{height: '100%'}}>

        <div className="Grid-cell" style={styles.cell}>
          <Hammer onTap={back}>
            <div className="buttonBG" style={ifStyle(
                styles.buttonBG,
                styles.subdue,
                slide < 2 && styles.hide
              )}>
              <div className="buttonIcon" style={styles.buttonIcon}>
                <div className="icon" style={styles.backIcon}>
                  <NextIcon color={colors(selectedColor).lightColor} />
                </div>
              </div>
            </div>
          </Hammer>
        </div>

        {/*<div className="Grid-cell" style={styles.cell}>
          <div className="buttonBG">
            <div className="buttonIcon" style={styles.buttonIcon}>
              <img className="userImage" style={styles.userImage} src={userImage}></img>
            </div>
          </div>
        </div>*/}

        <div className="Grid-cell" style={ifStyle(
            styles.cell,
            isSelectingColor === true && styles.noTouch
          )}>
          <Hammer onTap={nextAction}>
            <div className="buttonBG" style={styles.buttonBG}>
              <div className="buttonIcon" style={styles.buttonIcon}>
                <div className="icon" style={styles.nextIcon}>
                  <NextIcon color={colors(selectedColor).lightColor} />
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
