import React, {Component} from 'react';
import CrateTemplate from 'components/Crates/CrateTemplate';
import {ifStyle} from '../utilities';
import Hammer from 'react-hammerjs';

class Subscriber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    }
  }
  selectSubscriber = () => {
    if (this.state.isSelected) {
      this.setState({isSelected: false});
      console.log(this.props.username + 'is not selected')
      this.props.newGiftee(null);
    } else {
      this.setState({isSelected: true});
      console.log(this.props.username)
      this.props.newGiftee(this.props.username);
    }
  }
  render() {
    const styles = {
      userBlock: {
        display: 'block',
        marginBottom: 15,
        borderBottom: '1px solid grey'
      },
      selectIconHolder: {
        float: 'right',
        marginRight: 20,
        marginTop: 7
      },
      selectIcon: {
        backgroundColor: 'transparent',
        height: 30,
        width: 30,
        borderRadius: '50%',
        border: '1px solid grey'
      },
      selected: {
        backgroundColor: '#FB70AF',
        border: 'none'
      },
    }
    return (
      <div key={this.props.key} className="clearfix" style={styles.userBlock}>
        <div className="left" style={{float: 'left', marginRight: 20, marginLeft: 40}}>
          <CrateTemplate color={'blue'} crateSize={40} pop={false}/>
        </div>
        <h5 style={{float: 'left', margin: '.5em 0 0 0'}}>{this.props.name}</h5>
        <p style={{float: 'left', marginTop: 10, marginLeft: 10}}>@{this.props.username}</p>
        <Hammer onTap={this.selectSubscriber}>
          <div className="selectIconHolder" style={styles.selectIconHolder}>
            <div className="selectIcon" style={ifStyle(
                styles.selectIcon,
                this.state.isSelected && styles.selected,
              )}></div>
          </div>
        </Hammer>
      </div>
    )
  }
}

export default Subscriber;
