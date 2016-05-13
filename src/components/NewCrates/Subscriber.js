import React, {Component} from 'react';
import FlexCrateTemplate, { colors } from 'components/Crates/FlexCrateTemplate';
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
        display: 'flex',
        padding: '10px 0 10px 0',
        borderBottom: '1px solid #F1F1F1'
      },
      selectedUserContainer: {
        backgroundColor: '#F7F7F7',
        borderBottom: '1px solid transparent'
      },
      userProfileCrate: {
        // float: 'left',
        margin: '0px 20px'
      },
      name: {
        float: 'left',
        margin: '6px 0 0 0'
      },
      selectedName: {
        // fontWeight: 'bold'
      },
      username: {
        float: 'left',
        margin: '11px 0 0 10px',
        color: '#C1C9D0'
      },
      selectIconHolder: {
        // float: 'right',
        // marginRight: 20,
        // marginTop: 15
        padding: '7px 20px'
      },
      selectIcon: {
        backgroundColor: 'transparent',
        height: 30,
        width: 30,
        borderRadius: '50%',
        border: '1px solid #F1F1F1'
      },
      selectedIcon: {
        backgroundColor: '#fff',
        border: 'none'
      },
      checkIcon: {
        paddingLeft: '6px',
        paddingTop: '3px'
      }
    }
    let CheckIconColor;
    if (this.state.isSelected) {
      CheckIconColor = this.props.myProfileColor.compliment
    } else {
      CheckIconColor = '#fff'
    }
    return (
      <div className="Subscriber">
        <Hammer onTap={this.selectSubscriber}>
          <div key={this.props.id} className="clearfixTEMP" style={ifStyle(
              styles.userContainer,
              this.state.isSelected && styles.selectedUserContainer
            )}>
            <div className="flex-auto">
              <div className="userCrate noTouch" style={styles.userProfileCrate}>
                <FlexCrateTemplate
                  color={this.props.thisSubscriberColor}
                  size={40}
                  type={'profile'}
                  shadow={false}
                  />
              </div>
            </div>
            <div className="flex-1">
              <h5 style={ifStyle(
                  styles.name,
                  this.state.isSelected && styles.selectedName
                )}>{this.props.name}</h5>
              <p style={styles.username}>@{this.props.username}</p>
            </div>
            <div className="flex-auto">
              <div className="selectIconHolder" style={styles.selectIconHolder}>
                <div className="selectIcon" style={ifStyle(
                    styles.selectIcon,
                    this.state.isSelected && styles.selectedIcon
                  )}>
                  <div className="checkIcon" style={styles.checkIcon}>
                    <CheckIcon color={CheckIconColor}/>
                  </div>
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
