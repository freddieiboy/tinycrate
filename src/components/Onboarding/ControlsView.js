import React from 'react';
import CrateTemplate, { colors } from '../Crates/CrateTemplate';
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
    userImage: {
      // height: '100px',
      // width: '100px',
      // borderRadius: '50%',
      // border: '3px solid' + colors(selectedColor).lightColor,
      // backgroundColor: colors(selectedColor).lightColor
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
      pointerEvents: 'none'
    }
  }
  let nextAction;
  slide === 5 ? nextAction = finish : nextAction = next
  return (
    <div className="ControlsView"  style={styles.ControlsView}>
      <div className="Grid Grid--center" style={{height: '100%'}}>

        <div className="Grid-cell" style={ifStyle(
            styles.cell,
            slide < 2 && styles.hide
          )}>
          <Hammer onTap={back}>
            <div className="buttonBG" style={ifStyle(
                styles.buttonBG,
                styles.subdue
              )}>
              <div className="buttonIcon" style={styles.buttonIcon}>
                <div className="icon" style={styles.backIcon}>
                  <NextIcon color={colors(selectedColor).lightColor} />
                </div>
              </div>
            </div>
          </Hammer>
        </div>

        <div className="Grid-cell" style={ifStyle(
            styles.cell,
            slide === 1 && styles.hide,
            selectedColor === 'empty' && styles.hide
          )}>
          <div className="buttonBG">
            <div className="buttonIcon" style={styles.buttonIcon}>
              {/*<img className="userImage" style={styles.userImage} src={userImage}></img>*/}
              <div className="userImage" style={styles.userImage}>
                <div className="center">
                  <CrateTemplate crateSize={80} color={colors(selectedColor)} crateType={'tutorial'} pop={'true'} popType={'2'} shadow={'false'}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="Grid-cell" style={ifStyle(
            styles.cell,
            isSelectingColor === true && Object.assign({}, styles.noTouch, styles.hide)
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
