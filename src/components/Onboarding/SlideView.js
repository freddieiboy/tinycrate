import React from 'react';
import SelectColorView from './SelectColorView';

const SlideView = ({
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
    slideText = 'Welcome to the world of Tinycrate!'
  } else if (slideState === 2) {
    slideImage = 'http://i.imgur.com/s61zxbY.gif'
    slideText = 'In this world, you communicate through tiny mysterious crates.'
  } else if (slideState === 3) {
    slideImage = 'http://i.imgur.com/YQOUmOe.png'
    slideText = 'It’s up to you to collect and send crates around the world through this Loot Messenger.'
  } else if (slideState === 4) {
    slideText = 'Crate colors are special in Tinycrate. Which color will you represent you? Choose one.'
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
      padding: '20px',
      fontSize: '1.8rem'
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
        <p>{slideText}</p>
      </div>
    </div>
  )
}

export default SlideView;
