import React from 'react';
import ProfileCrate from './ProfileCrate';
import CrateTemplate from './CrateTemplate';

const ProfileCrateList = ({onOpen, item, index, itemsLength, color}) => {
  //TODO: pass in user profile color
  console.log(item.username)
  return(
    <div className="user-avatar-holder" style={{height: '100%'}}>
      {/*<ProfileCrate msg={item} id={item.key} onOpen={onOpen} crateId={item.crateId} username={item.username} profileImageURL={item.profileImageURL} color={item.crateColor}></ProfileCrate>*/}
      <CrateTemplate
        id={item.key}
        onOpen={onOpen}
        crateId={item.crateId}
        username={item.username}
        crateSize={80}
        color={'pink'}
        crateType={'profile'}
        cratePreview={item.profileImageURL}
        pop={true}
        popType={'1'}
        />
    </div>
  )
}

export default ProfileCrateList;
