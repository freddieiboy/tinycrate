import React, {Component} from 'react';
import CrateTemplate, { colors } from 'components/Crates/CrateTemplate';
import {ifStyle} from '../utilities';
import Hammer from 'react-hammerjs';
import {flattenObject} from '../utilities';
import {CheckIcon} from 'components/NewCrates/Icons';

//TODO: make userContainer actually scalable. only mobile for now.

class Subscriber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    }
  }
  selectSubscriber = () => {
    const filterForUserInfo = this.props.storeSubs.filter((user) => {
      return user.username === this.props.username;
    });
    const gifteeInfo = flattenObject(filterForUserInfo);

    if (this.state.isSelected) {
      this.setState({isSelected: false});
      // var index =
      this.props.removeGifteeAction(gifteeInfo.uid);
    } else {
      this.setState({isSelected: true});
      this.props.newGifteeAction(gifteeInfo.uid);
    }
  }
  render() {
    const styles = {
      userContainer: {
        display: 'block',
        padding: '10px 0 10px 0',
        borderBottom: '1px solid #F1F1F1'
      },
      selectedUserContainer: {
        backgroundColor: '#F7F7F7',
        borderBottom: '1px solid transparent'
      },
      userProfileCrate: {
        float: 'left',
        margin: '10px 20px 0 40px'
      },
      name: {
        float: 'left',
        margin: '15px 0 0 0'
      },
      selectedName: {
        // fontWeight: 'bold'
      },
      username: {
        float: 'left',
        margin: '21px 0 0 10px',
        color: '#C1C9D0'
      },
      selectIconHolder: {
        float: 'right',
        marginRight: 20,
        marginTop: 15
      },
      selectIcon: {
        backgroundColor: 'transparent',
        height: 30,
        width: 30,
        borderRadius: '50%',
        border: '1px solid #F1F1F1'
      },
      selectedIcon: {
        backgroundColor: this.props.userColor.lightColor,
        border: 'none'
      },
      checkIcon: {
        paddingLeft: '6px',
        paddingTop: '3px'
      }
    }
    return (
      <div>
        <Hammer onTap={this.selectSubscriber}>
          <div key={this.props.id} className="clearfix" style={ifStyle(
              styles.userContainer,
              this.state.isSelected && styles.selectedUserContainer
            )}>
            <div className="userCrate noTouch" style={styles.userProfileCrate}>
              <CrateTemplate color={'blue'} crateSize={40} pop={false} shadow={false}/>
            </div>
            <h5 style={ifStyle(
                styles.name,
                this.state.isSelected && styles.selectedName
              )}>{this.props.name}</h5>
            <p style={styles.username}>@{this.props.username}</p>
            <div className="selectIconHolder" style={styles.selectIconHolder}>
              <div className="selectIcon" style={ifStyle(
                  styles.selectIcon,
                  this.state.isSelected && styles.selectedIcon
                )}>
                <div className="checkIcon" style={styles.checkIcon}>
                  <CheckIcon />
                </div>
              </div>
            </div>
          </div>
        </Hammer>
      </div>
    )
  }
}

export default Subscriber;
