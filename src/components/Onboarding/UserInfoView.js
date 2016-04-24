import React from 'react';
import { colors } from '../Crates/CrateTemplate';
import Input from './Input';

const UserInfoView = ({userImage, selectedColor, name, username}) => {
  const userColor = colors(selectedColor).lightColor;
  const styles = {
    UserInfoView: {
      height: '70%'
    },
    userCard: {
      backgroundColor: 'white',
      height: '100%'
    },
    userImage: {
      height: '120px',
      width: '120px',
      borderRadius: '50%',
      border: '5px solid' + userColor,
      backgroundColor: userColor
    },
    providerIcon: {
      position: 'absolute',
      right: '0px',
      bottom: '0px',
      height: '50px',
      width: '50px',
      borderRadius: '50%',
      backgroundColor: userColor
    },
    image: {
      height: '120px',
      width: '120px',
      position:'relative',
    },
    form: {
      minWidth: '75%'
    },
  }
  console.log(userImage)
  return (
    <div className="UserInfoView" style={styles.UserInfoView}>
      <div className="userCard" style={styles.userCard}>

        <div className="userName Grid Grid--center-content">
          <div className="Grid-cell">
            Hey, Freddie Iboy
          </div>
        </div>

        <div className="userImageContainer Grid Grid--center-content" style={styles.userImageContainer}>
          <div className="Grid-cell">
            <div className="image" style={styles.image}>
              <img src={userImage} style={styles.userImage}></img>
              <div className="providerIcon" style={styles.providerIcon}></div>
            </div>
          </div>
        </div>

        <div className="txt Grid Grid--center-content">
          <div className="Grid-cell">
            You can change your info.
          </div>
        </div>
        <div className="inputContainer Grid Grid--center-content">
          <div className="Grid-cell" style={styles.form}>
            <form>
              <Input label={'Full Name'} value={name}/>
              <Input label={'Username'} value={'@' + username}/>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfoView;
