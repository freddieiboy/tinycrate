import React, { Component } from 'react';
import CrateTemplate from '../Crates/CrateTemplate';

class SelectColorView extends Component {
  componentDidMount() {
    this.props.selectedColor === 'empty' ? this.props.start() : null
  }
  componentWillUnmount() {
    this.props.end();
  }
  render() {
    let {selectColor} = this.props;
    const styles = {
      SelectColorView: {
        paddingTop: '50px',
        overflow: 'hidden',
        height: '100%'
      },
      crate: {
        marginLeft: '10px',
        marginRight: '10px',
        marginBottom: '40px'
      }
    }
    const singleCrate = (color) => {
      return <div className="Grid-cell" style={styles.crate} onMouseDown={() => selectColor(color)} onTouchEnd={() => selectColor(color)}>
        <CrateTemplate pop={true} popType={'1'} crateType={'tutorial'} color={color} crateSize={80}/>
      </div>
    }
    return (
      <div className="SelectColorView" style={styles.SelectColorView} onMouseUp={singleCrate}>
        <div className="crateColorsContainer" style={styles.crateColorsContainer}>
          <div className="row1 Grid Grid--center" style={styles.row}>
            {singleCrate('green')}
            {singleCrate('pink')}
            {singleCrate('blue')}
          </div>
          <div className="row2 Grid Grid--center" style={styles.row}>
            {singleCrate('purple')}
            {singleCrate('orange')}
            {singleCrate('yellow')}
          </div>
        </div>
      </div>
    )
  }
}

export default SelectColorView;
