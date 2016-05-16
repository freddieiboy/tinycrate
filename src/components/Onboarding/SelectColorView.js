import React, { Component } from 'react';
import FlexCrateTemplate from '../Crates/FlexCrateTemplate';
import Hammer from 'react-hammerjs';

var options = {
    touchAction:'compute',
    recognizers: {
        tap: {
            time: 60,
            threshold: 100
        }
    }
};

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
        paddingTop: '30px',
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
      return <div className="Grid-cell Grid--center-content" style={styles.crate}>
        <Hammer onTap={() => selectColor(color)}>
          <FlexCrateTemplate
            pop={1}
            type={'tutorial'}
            color={color}
            size={60}
            shadow={true}
            />
        </Hammer>
      </div>
    }
    return (
      <div className="SelectColorView" style={styles.SelectColorView}>
        <div className="crateColorsContainer center-relative">
          <div className="row1 Grid Grid--fit" style={styles.row}>
            {singleCrate('green')}
            {singleCrate('pink')}
            {singleCrate('blue')}
            {singleCrate('snow')}
          </div>
          <div className="row2 Grid Grid--fit" style={styles.row}>
            {singleCrate('purple')}
            {singleCrate('orange')}
            {singleCrate('yellow')}
            {singleCrate('obsidian')}
          </div>
        </div>
      </div>
    )
  }
}

export default SelectColorView;
