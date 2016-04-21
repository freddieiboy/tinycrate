import React from 'react';
import { colors } from '../Crates/CrateTemplate';
import { ifStyle } from '../utilities';
import { NextIcon } from '../NewCrates/Icons';

const ControlsView = ({slide, back, next, selectedColor}) => {
  const styles = {
    ControlsView: {
      height: '100%'
    },
    buttonBG: {
      height: '100px',
      width: '100px',
      borderRadius: '50%',
      backgroundColor: '#1E1E1E',
      left: '50%',
      position: 'absolute',
      marginLeft: '-50px',
      marginTop: '-50px',
    },
    cell: {
      position: 'relative'
    },
    hide: {
      visibility: 'hidden'
    },
    buttonIcon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }
  return (
    <div className="ControlsView"  style={styles.ControlsView}>
      <div className="Grid Grid--center" style={{height: '100%'}}>
        <div className="Grid-cell" style={styles.cell}>
          <div className="buttonBG" style={ifStyle(
              styles.buttonBG,
              slide < 2 && styles.hide
            )} onClick={back}>
            <div className="buttonIcon" style={styles.buttonIcon}>+</div>
          </div>
        </div>
        <div className="Grid-cell" style={styles.cell}>
          <div className="buttonBG" style={styles.buttonBG} onClick={back}>
            <div className="buttonIcon" style={styles.buttonIcon}>'shsh'</div>
          </div>
        </div>
        <div className="Grid-cell" style={styles.cell}>
          <div className="buttonBG" style={styles.buttonBG} onClick={next}>
            <div className="buttonIcon" style={styles.buttonIcon}>
              <NextIcon color={colors(selectedColor).lightColor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlsView;
