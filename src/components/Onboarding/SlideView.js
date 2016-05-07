import React from 'react';
import SelectColorView from './SelectColorView';

const SlideView = ({
    mode,
    selectColor,
    slide,
    startSelectColor,
    endSelectColor,
    selectedColor
  }) => {
  let slideImage;
  let slideText;
  const slideState = slide;
  if (slideState === 1) {
    slideImage = 'http://i.imgur.com/uMgW8F2.gif'
    slideText = 'Welcome to the world of Tinycrate: the Loot Messenger!'
  } else if (slideState === 2) {
    slideImage = 'http://i.imgur.com/s61zxbY.gif'
    slideText = 'In this world, you communicate through tiny mysterious crates that can hold anything.'
  } else if (slideState === 3) {
    slideImage = 'http://i.imgur.com/YQOUmOe.png'
    slideText = 'You are going to collect treasures and send crates around the world through Tinycrate.'
  } else if (slideState === 4) {
    if (mode === 'settings') {
      slideText = 'Do you want to change your profile color?'
    } else {
      slideText = 'Touch the crate with the right color for you. This is yours now. Take care of it, ok?'
    }
  }
  const styles = {
    SlideView: {
      height: '70%'
      //NOTE: do i need this?
    },
    imageContainer: {
      width: '100vw',
      height: '70%',
      backgroundColor: '#FEFDFA'
    },
    image: {
      height: '100%',
      backgroundImage: 'url(' + slideImage + ')',
      backgroundPosition: 'center',
      backgroundSize: 'auto 100%',
      backgroundRepeat: 'no-repeat'
    },
    messageContainer: {
      width: '100vw',
      height: '30%',
      border: '2px solid #D9D9D9',
      backgroundColor: '#FEFDFA',
      padding: '0 20px',
      fontSize: '1.8rem',
      overflow: 'scroll',
      overflowX: 'hidden'
    },
    noMargin: {
      margin: '0px'
    }
  }
  const selectingColors = slide !== 4;
  return (
    <div className="SlideView" style={styles.SlideView}>
      <div className="imageContainer" style={styles.imageContainer}>
        {selectingColors ? (
          <div className="image" style={styles.image}></div>
        ) : (
          <SelectColorView
            start={startSelectColor}
            end={endSelectColor}
            selectColor={selectColor}
            selectedColor={selectedColor}
            />
        )}
      </div>
      <div className="messageContainer" style={styles.messageContainer}>
        <div className="center-relative">
          <p style={styles.noMargin}>{slideText}</p>
        </div>
      </div>
    </div>
  )
}

export default SlideView;
