import React from 'react';
import { colors } from '../Crates/CrateTemplate';
import { ClockIcon, CancelIcon } from '../NewCrates/Icons';
import Hammer from 'react-hammerjs';
import { ifStyle } from '../utilities';

const DefaultCrateView = ({
  openedCrate,
  currentCrateColor,
  closePreview,
  viewPhoto,
  timestamp,
  isDefaultCrate
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
      width: '100%',
      backgroundColor: '#000'
    },
    topContainer: {
      flex: topFlexBoxStyle,
      backgroundColor: hasImage ? '#F5F6FA' : colors(currentCrateColor).darkColor,
      position: 'relative'
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
      padding: '20px',
      color: '#838B9E',
      backgroundColor: '#EBEEF5',
      overflowY: 'scroll',
      borderBottomRightRadius: isDefaultCrate ? '15px' : '0px',
      borderBottomLeftRadius: isDefaultCrate ? '15px' : '0px'
    },
    attribution: {
      display: 'flex',
      opacity: '.5'
    },
    innerLeft: {
      flex: '1'
    },
    innerRight: {
      flex: '1',
      alignSelf: 'flex-end',
    },
    clockIcon: {
      float: 'left',
      marginRight: '5px'
    },
    timestamp: {
      marginTop: '2px',
      marginBottom: '0px'
    },
    authorName: {
      marginTop: '3px',
      textAlign: 'right'
    },
    crateText: {
      display: 'flex',
    },
    crateTextBody: {
      flex: '1',
      textAlign: 'center',
    },
    closePreviewContainer: {
      position: 'absolute',
      top: '0px',
      right: '0px',
      margin: '19px 25px',
      height: '30px',
      width: '30px',
      borderRadius: '50%',
      backgroundColor: 'white',
      boxShadow: '0px 2px 3px 0px rgba(0,0,0,0.20)'
    },
    closeIcon: {
      transform: 'scale(.7)',
      margin: '-2px 0 0 4px'
    },
  }
  let closeAction;
  if (isDefaultCrate) {
    closeAction = <Hammer onTap={closePreview}>
      <div className="closePreviewContainer" style={styles.closePreviewContainer}>
        <div className="closeIcon" style={styles.closeIcon}>
          <CancelIcon color={colors(currentCrateColor).darkColor}/>
        </div>
      </div>
    </Hammer>
  } else {
    closeAction = '';
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
            !hasImage && styles.topTextStyle
          )}>
          {topContent}
          {closeAction}
        </div>
      </div>

      <div className="bottomContainer" style={styles.bottomContainer}>
        <div className="attribution" style={styles.attribution}>
          <div className="innerLeft" style={styles.innerLeft}>
            <div className="clockIcon" style={styles.clockIcon}>
              <ClockIcon color={'#838B9E'}/>
            </div>
            <h6 style={styles.timestamp}>
              {timestamp}
            </h6>
          </div>
          <div className="innerRight" style={styles.innerRight}>
            <div style={styles.authorName}>
              <h6>
                {openedCrate.authorDisplayName}
              </h6>
            </div>
          </div>
        </div>
        <div className="crateText" style={styles.crateText}>
          <div className="crateTextBody" style={styles.crateTextBody}>
            {hasImage && hasText ?
              <h5 style={{margin: '0px'}}>
                {openedCrate.text}
              </h5>
              : ''
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultCrateView;