import React from 'react';
import Hammer from 'react-hammerjs';
import { ClockIcon, CancelIcon } from '../NewCrates/Icons';
import { colors } from '../Crates/CrateTemplate';

const TextImageCrateView = ({
  openedCrate,
  currentCrateColor,
  closePreview,
  viewPhoto,
  timestamp
}) => {
  const styles = {
    TextImageCrateView: {
      left: '0px',
      right: '0px',
      top: '0px',
      height: '70%',
    },
    closePreview: {
      position: 'absolute',
      top: '0px',
      right: '0px',
      margin: '13px 25px',
      height: '30px',
      width: '30px',
      borderRadius: '50%',
      backgroundColor: 'white',
      boxShadow: '0px 2px 3px 0px rgba(0,0,0,0.32)'
    },
    closeIcon: {
      transform: 'scale(.7)',
      margin: '-2px 0 0 3px'
    },
    crateImage: {
      marginTop: '0px',
      marginLeft: '0px',
      height: '70%',
      backgroundColor: openedCrate.image ? '#F5F6FA' : colors(currentCrateColor).darkColor,
      overflow: 'hidden',
      // borderTopRightRadius: '10px',
      // borderTopLeftRadius: '10px',
    },
    cratePageInfo: {
      textAlign: 'center',
      maxHeight: '30%',
      color: '#838B9E',
      paddingBottom: '1em',
      backgroundColor: '#ECEEF5',
      borderBottomRightRadius: '10px',
      borderBottomLeftRadius: '10px',
      marginLeft: '0px',
      overflowY: 'scroll'
    },
    controlsView: {
      left: '0px',
      height: '30%'
    },
    openText: {
      maxWidth: '100%',
      textAlign: 'center',
      padding: '15px',
      position:'relative',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'white'
    },
    timestamp: {
      float: 'left',
      paddingLeft: '10px',
      opacity: '.7',
      marginTop: '2px'
    },
    authorName: {
      float: 'right',
      paddingRight: '20px',
      marginTop: '2px'
    },
    clockIcon: {
      float: 'left',
      marginLeft: '20px',
      opacity: '.5'
    },
    openedText: {
      padding: '5px 20px'
    },
  }
  var crateHeroContent;
  if (openedCrate.image) {
    crateHeroContent = <Hammer onDoubleTap={viewPhoto}><div id="crateHeroImage" style={{height: '100%', textAlign: 'center', position: 'relative'}} /></Hammer>
  } else {
    crateHeroContent = <div className="openText" style={styles.openText}><h4>{openedCrate.text}</h4></div>
  }
  const hasImage = openedCrate.image;
  const hasText = openedCrate.text;

  return (
    <div className="TextImageCrateView" style={styles.TextImageCrateView}>
      <div className="Grid u-textCenter crateImage"  style={styles.crateImage}>
        <div className="Grid-cell" style={{height: '100%'}}>
          {crateHeroContent}
          <Hammer onTap={closePreview}>
            <div className="closePreview" style={styles.closePreview}>
              <div className="closeIcon" style={styles.closeIcon}>
                <CancelIcon color={colors(currentCrateColor).darkColor}/>
              </div>
            </div>
          </Hammer>
        </div>
      </div>
      <div className="Grid u-textCenter cratePageInfo" style={styles.cratePageInfo}>
        <div className="Grid-cell user-info-holder" style={{paddingTop: '12px'}}>
          <div className="attribution clearfix">
            <div style={styles.authorName}>
              <h6>
                {openedCrate.authorDisplayName}
              </h6>
            </div>
            <div className="clockIcon" style={styles.clockIcon}>
              <ClockIcon color={'#838B9E'}/>
            </div>
            <div style={styles.timestamp}>
              <h6>
                {timestamp}
              </h6>
            </div>
          </div>
          <div className="text" style={{display: 'block'}}>
            {hasImage && hasText ?
              <div style={styles.openedText}>
                <h5 style={{margin: '0px'}}>
                  {openedCrate.text}
                </h5>
              </div>
              : ''
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextImageCrateView;
