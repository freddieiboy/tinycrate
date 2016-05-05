import React from 'react';
import { StarIcon, RegiftIcon, CancelIcon } from '../NewCrates/Icons';
import FlexCrateTemplate, { colors } from '../Crates/FlexCrateTemplate';
import { ifStyle } from '../utilities';
import Hammer from 'react-hammerjs';

const CondensedControlsView = ({
  userImage,
  saveToProfile,
  regift,
  viewSenderProfile,
  thisCrateColor,
  crateContentsSaved,
  author,
  closePreview
}) => {
  const styles = {
    CondensedControlsView: {
      display: 'flex',
      textAlign: 'center',
      height: '100px',
      backgroundColor: 'snow',
      boxShadow: '0px -3px 12px 0px rgba(126,126,126,0.38)'
    },
    controlBox: {
      flex: '1',
      border: '1px solid white',
      height: '100%',
      borderLeft: '1px solid #E4E4E4',
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
    crate: {
      flex: '0 50%'
    },
    regiftIcon:  {
      transform: 'rotate(90deg)',
      marginLeft: '-5px'
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
      boxShadow: '0px 2px 3px 0px rgba(0,0,0,0.22)'
    }
  }
  const color = colors(thisCrateColor).lightColor;
  return (
    <div className="CondensedControlsView" style={styles.CondensedControlsView}>
      <div className="crateContainer" style={ifStyle(styles.controlBox, styles.crate)}>
        <div className="controlContents" style={styles.crateControlContents}>
          <FlexCrateTemplate
            color={thisCrateColor}
            size={60}
            type={'profile'}
            preview={userImage}
            pop={1}
            shadow={true}
            />
          <p style={styles.author}>{author}</p>
        </div>
      </div>
      <div className="saveContainer" style={styles.controlBox}>
        <Hammer onTap={saveToProfile}>
          <div className="controlContents" style={styles.controlContents}>
            <StarIcon color={color} />
          </div>
      </Hammer>
      </div>
      <div className="regiftContainer" style={styles.controlBox}>
        <Hammer onTap={regift}>
          <div className="controlContents" style={styles.controlContents}>
            <div className="regiftIcon" style={styles.regiftIcon}>
              <RegiftIcon color={color} />
            </div>
          </div>
        </Hammer>
      </div>
      <div className="closeContainer" style={styles.controlBox}>
        <Hammer onTap={closePreview}>
          <div className="controlContents" style={styles.controlContents}>
            <div className="cancelBG" style={styles.cancelBG}></div>
            <div className="cancel" style={styles.cancel}>
              <CancelIcon color={color} />
            </div>
          </div>
        </Hammer>
      </div>
    </div>
  )
}

export default CondensedControlsView;
