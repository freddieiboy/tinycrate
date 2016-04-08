import React from 'react';
import ProfileCrate from './ProfileCrate';

const ProfileCrateList = ({onOpen, item, index, itemsLength, color}) => {
  return(
    <div className="user-avatar-holder" style={{height: '100%'}}>
    <ProfileCrate msg={item} id={item.key} onOpen={onOpen} username={item.username} profileImageURL={item.profileImageURL}></ProfileCrate>
    </div>
  )
}

export default ProfileCrateList;
