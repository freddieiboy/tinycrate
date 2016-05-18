import React from 'react';
import Crate from './Crate';
import FlexCrateTemplate from './FlexCrateTemplate';

const CrateList = ({onDelete, item, index, itemsLength, color}) => {
  // const onDelete = this.props.onDelete;
  // const { item, index, itemsLength, color} = this.props;
  // return <Crate msg={item} id={item.key} onDelete={onDelete} color={item.crateColor}></Crate>
  // console.log(item.image)
  return <FlexCrateTemplate
      id={item.key}
      size={80}
      onDelete={onDelete}
      color={item.crateColor}
      preview={item.image}
      shadow={true}
      type={'normal'}
      pop={1}
      crateOwnerImage={item.authorProfileImageURL}
      animation={'animated bounce'}
      />
}

export default CrateList;
