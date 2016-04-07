import React from 'react';
import Crate from './Crate';

const CrateList = ({onDelete, item, index, itemsLength, color}) => {
  // const onDelete = this.props.onDelete;
  // const { item, index, itemsLength, color} = this.props;
  return <Crate msg={item} id={item.key} onDelete={onDelete} color={item.crateColor}></Crate>
}

export default CrateList;
