import React from 'react';
import CrateTemplate from '../Crates/CrateTemplate';

const SelectColorView = ({selectColor}) => {
  const styles = {
    SelectColorView: {
      position: 'relative',
      height: '100%',
      left: '50%',
      marginLeft: '-160px',
      overflow: 'hidden',
      paddingTop: '50px'
    },
    crateColorsContainer: {
      position: 'absolute'
    },
    row: {
      height: '140px'
    },
    crate: {
      marginLeft: '20px',
      marginBottom: '40px'
    }
  }
  const singleCrate = (color) => {
    return <div className="float-left" style={styles.crate} onMouseDown={() => selectColor(color)} onTouchEnd={() => selectColor(color)}>
      <CrateTemplate pop={false} crateType={'tutorial'} color={color} crateSize={80}/>
    </div>
  }
  return (
    <div className="SelectColorView " style={styles.SelectColorView} onMouseUp={singleCrate}>
      <div className="crateColorsContainer" style={styles.crateColorsContainer}>
        <div className="row1" style={styles.row}>
          {singleCrate('green')}
          {singleCrate('pink')}
          {singleCrate('blue')}
        </div>
        <div className="row2" style={styles.row}>
          {singleCrate('purple')}
          {singleCrate('orange')}
          {singleCrate('yellow')}
        </div>
      </div>
    </div>
  )
}

export default SelectColorView;
