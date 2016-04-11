import React from 'react';
import ProfileCrate from './ProfileCrate';

const ProfileCrateList = ({onOpen, item, index, itemsLength, color}) => {
  return(
    <div className="user-avatar-holder" style={{height: '100%'}}>
    <ProfileCrate msg={item} id={item.key} onOpen={onOpen} crateId={item.crateId} username={item.username} profileImageURL={item.profileImageURL} color={item.crateColor}></ProfileCrate>
    </div>
  )
}

export default ProfileCrateList;
