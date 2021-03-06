import React from 'react';
import { colors } from '../Crates/CrateTemplate';
import { ClockIcon, CancelIcon } from '../NewCrates/Icons';
import { styleCrateHeroImage, getCrateVideo } from '../Crates/CrateUtils';
import Hammer from 'react-hammerjs';
import { ifStyle, isPhoto } from '../utilities';
import $ from 'jquery';

const DefaultCrateView = ({
  openedCrate,
  contextCrate,
  currentCrateColor,
  closePreview,
  viewPhoto,
  timestamp,
  isDefaultCrate
}) => {
  const hasImage = openedCrate.image;
  const hasText = openedCrate.text;
  const contextCrateHasImage = contextCrate !== null && contextCrate.image;
  const contextCrateHasText = contextCrate !== null && contextCrate.text;
  const isSaveNotification = openedCrate.type && openedCrate.type === "notification" && openedCrate.subtype && openedCrate.subtype === "save";
  const isReactionNotification = openedCrate.type && openedCrate.type === "notification" && openedCrate.subtype && openedCrate.subtype === "reactions";
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
      borderBottomLeftRadius: isDefaultCrate ? '15px' : '0px',
      // zIndex: '0'
    },
    crateHeroImageContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '-1',
      height: '100%',
      width: '100%'
    },
    crateHeroImage: {
      zIndex: 0,
      position: 'relative',
      width: '100%',
      height: '100%'
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
    reactionEmoji: {
      transform: 'scale(5)',
      // fontSize: '6em'
    },
    reactionAuthor: {
      marginTop: '2em'
    }
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
    topContent = <Hammer onTap={viewPhoto}><div id="crateHeroImage" style={styles.crateHeroImage} /></Hammer>
  } else {

    if((isSaveNotification || isReactionNotification) && contextCrateHasImage) {
      if(contextCrate.image && !$("#contextCrateImage").length) {
        var uploadAlertText = 'Loading ' + (isPhoto(contextCrate.image) ? 'image...' : 'video...');
        notie.alert(4, uploadAlertText);

        if(isPhoto(contextCrate.image)) {
          var image = new Image();
          image.onload = function() {
            // programatically remove the "Loading image..." alert
            $("#notie-alert-outer").click();
            let width = image.width;
            let height = image.height;
            styleCrateHeroImage(image, width, height);
            $(image).css("z-index", "-1");
            $(image).css("-webkit-filter", "blur(1.5px)");
            var topContainerBackgroundColor = $(".topContainer").css('background-color');
            if(topContainerBackgroundColor.indexOf('a') == -1){
              var result = topContainerBackgroundColor.replace(')', ', 0.8)').replace('rgb', 'rgba');
            }
            $(".inner").css("background-color", result);
            $(".topContainer").css("opacity", "0.9");
            $("#crateHeroImageContainer").append(image);
          }
          image.id = "contextCrateImage";
          image.src = contextCrate.image;
        } else {
          getCrateVideo(contextCrate.image).then(function(video) {
            $(video).bind("loadedmetadata", function () {
              var width = this.videoWidth;
              var height = this.videoHeight;
              console.log(width, height)
              styleCrateHeroImage(video, width, height);
            });
            video.setAttribute("webkit-playsinline", true);
            $(video).css("z-index", "-1");
            var topContainerBackgroundColor = $(".topContainer").css('background-color');
            if(topContainerBackgroundColor.indexOf('a') == -1){
              var result = topContainerBackgroundColor.replace(')', ', 0.8)').replace('rgb', 'rgba');
            }
            $(".inner").css("background-color", result);
            $(".topContainer").css("opacity", "0.9");
            video.onloadeddata = function() {
              // programatically remove the "Loading video..." alert
              $("#notie-alert-outer").click();
            };
            $("#crateHeroImageContainer").append(video);
          });
        }
      }
        var text;
        if (openedCrate.subtype === 'reactions') {
          const oldtext = openedCrate.text;
          var emoji = oldtext.slice(0, 2);
          var attr = oldtext.slice(3);
          // text = nextText;
          topContent = <div id="crateHeroImageContainer" className='center-text'>
              <div className="reactionEmoji" style={styles.reactionEmoji}>{emoji}</div>
              <h4 style={styles.reactionAuthor}>{attr}</h4>
            </div>
          } else {
            text = <h4>{openedCrate.text}</h4>;
            topContent = <div id="crateHeroImageContainer" style={styles.crateHeroImageContainer}></div>
          }
    } else {

      let text;
      if (openedCrate.subtype === 'reactions') {
        const oldtext = openedCrate.text;
        var emoji = oldtext.slice(0, 2);
        var attr = oldtext.slice(3);
        // text = nextText;
        topContent = <div className='center-text'>
            <div className="reactionEmoji" style={styles.reactionEmoji}>{emoji}</div>
            <h4 style={styles.reactionAuthor}>{attr}</h4>
          </div>
      } else {
        text = openedCrate.text;
        topContent = <h4>{text}</h4>
      }
    }
  }

  return (
    <div className="DefaultCrateView" style={styles.DefaultCrateView}>
      <div className="topContainer" style={styles.topContainer}>
        <div className="inner absolute full-container" style={ifStyle(
            !hasImage && styles.topTextStyle
          )}>
          {text}
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
            {!isSaveNotification && !isReactionNotification && hasImage && hasText ?
              <h5 style={{margin: '0px'}}>
                {openedCrate.text}
              </h5>
              : ''
            }
            {(isSaveNotification || isReactionNotification) && contextCrateHasText ?
              <h5 style={{margin: '0px'}}>
                {'"' + contextCrate.text + '"'}
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
