import React from 'react';
import { colors } from '../Crates/CrateTemplate';
import Hammer from 'react-hammerjs';
import { ifStyle } from '../utilities';

const DefaultCrateView = ({
  openedCrate,
  currentCrateColor,
  closePreview,
  viewPhoto,
  timestamp
}) => {
  const hasImage = openedCrate.image;
  const hasText = openedCrate.text;
  let topFlexBoxStyle;
  if (hasText && hasImage) {
    topFlexBoxStyle = '0 70%'
  } else if (hasText && !hasImage || !hasText && hasImage) {
    topFlexBoxStyle = '0 80%'
  }
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
      flex: topFlexBoxStyle,
      backgroundColor: hasImage ? '#F5F6FA' : colors(currentCrateColor).darkColor,
      position: 'relative'
    },
    inner: {
      //NOTE: are there shared styles with only text and only photos?
    },
    topTextStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      height: '100%',
      width: '100%',
      padding: '60px 30px',
      color: 'white'
    },
    bottomContainer: {
      flex: '1',
    }
  }
  var topContent;
  if (openedCrate.image) {
    topContent = <Hammer onDoubleTap={viewPhoto}><div id="crateHeroImage" style={styles.crateHeroImage} /></Hammer>
  } else {
    topContent = <h4>{openedCrate.text}</h4>
  }
  return (
    <div className="DefaultCrateView" style={styles.DefaultCrateView}>
      <div className="topContainer" style={styles.topContainer}>
        <div className="inner" style={ifStyle(
            styles.inner,
            !hasImage && styles.topTextStyle
          )}>
          {topContent}
        </div>
      </div>
      <div className="bottomContainer" style={styles.bottomContainer}></div>
    </div>
  )
}

export default DefaultCrateView;
