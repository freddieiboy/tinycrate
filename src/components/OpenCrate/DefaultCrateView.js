import React from 'react';
import { colors } from '../Crates/CrateTemplate';
import Hammer from 'react-hammerjs';

const DefaultCrateView = ({
  openedCrate,
  currentCrateColor,
  closePreview,
  viewPhoto,
  timestamp
}) => {
  const styles = {
    DefaultCrateView: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '0px',
      height: '100%',
      width: '100%'
    },
    topContainer: {
      flex: '0 70%',
      backgroundColor: colors(currentCrateColor).darkColor,
      position: 'relative'
    },
    innerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      height: '100%',
      width: '100%',
      padding: '60px 30px'
    },
    topText: {
      color: 'white'
    },
    bottomContainer: {
      flex: '1',
    }
  }
  var topContent;
  if (openedCrate.image) {
    // topContent = <Hammer onDoubleTap={viewPhoto}><div id="crateHeroImage" style={styles.crateHeroImage} /></Hammer>
  } else {
    topContent = <div className="topText" style={styles.topText}><h4>{openedCrate.text}</h4></div>
  }
  const hasImage = openedCrate.image;
  const hasText = openedCrate.text;
  return (
    <div className="DefaultCrateView" style={styles.DefaultCrateView}>
      <div className="topContainer" style={styles.topContainer}>
        <div className="innerContainer" style={styles.innerContainer}>
          {topContent}
        </div>
      </div>
      <div className="bottomContainer" style={styles.bottomContainer}></div>
    </div>
  )
}

export default DefaultCrateView;
