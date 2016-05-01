import React, { Component } from 'react';
import { colors } from '../Crates/CrateTemplate';
import { TwitterIcon, FacebookIcon, CrateOutline } from '../NewCrates/Icons';
import Input from './Input';

class UserInfoView extends Component {
  render() {
    let {userImage, selectedColor, name, username, isUsernameAvailable, provider} = this.props;
    const userColor = colors(selectedColor).lightColor;
    const styles = {
      UserInfoView: {
        height: '70%'
      },
      userCard: {
        backgroundColor: 'white',
        height: '100%',
      },
      userImage: {
        height: '120px',
        width: '120px',
        borderRadius: '50%',
        backgroundColor: userColor
      },
      providerIcon: {
        position: 'absolute',
        right: '0px',
        bottom: '0px',
        height: '50px',
        width: '50px',
        borderRadius: '50%',
        backgroundColor: userColor,
        border: '3px solid white',
      },
      imageContainer: {
        height: '120px',
        width: '120px',
        position:'relative',
        margin: '0 0 20px 0'
      },
      form: {
        minWidth: '75%'
      },
    }
    let loginIcon;
    let providerTitle;
    if (provider === 'twitter') {
      loginIcon = <TwitterIcon />
      providerTitle = 'Twitter'
    } else {
      loginIcon = <FacebookIcon />
      providerTitle = 'Facebook'
    }
    return (
      <div className="UserInfoView" style={styles.UserInfoView}>
        <div className="userCard" style={styles.userCard}>
          <div className="center-relative">
            <div className="userName Grid Grid--center-content">
              <div className="Grid-cell">
                <h5>Hey, {name}</h5>
              </div>
            </div>

            <div className="userImageContainer Grid Grid--center-content" style={styles.userImageContainer}>
              <div className="Grid-cell">
                <div className="imageContainer" style={styles.imageContainer}>
                  <img src={userImage} style={styles.userImage}></img>
                  <div className="providerIcon" style={styles.providerIcon}>
                    <div className="icon center">
                      {loginIcon}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="instructions Grid Grid--center-content">
              <div className="Grid-cell">
                <h6>Your info is pulled from {providerTitle}.</h6>
              </div>
            </div>
            <div className="inputContainer Grid Grid--center-content">
              <div className="Grid-cell" style={styles.form}>
                <form>
                  <Input label={'Full Name'} value={name}/>
                  <Input label={'Username'} value={'@' + username} isUsernameAvailable={isUsernameAvailable}/>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserInfoView;
