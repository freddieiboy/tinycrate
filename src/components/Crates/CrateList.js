import React from 'react';
import Crate from './Crate';
import CrateTemplate from './CrateTemplate';

const CrateList = ({onDelete, item, index, itemsLength, color}) => {
  // const onDelete = this.props.onDelete;
  // const { item, index, itemsLength, color} = this.props;
  // return <Crate msg={item} id={item.key} onDelete={onDelete} color={item.crateColor}></Crate>
  // console.log(item.image)
  return <CrateTemplate
    id={item.key}
    crateSize={80}
    onDelete={onDelete}
    color={item.crateColor}
    cratePreview={item.image}
    shadow={'true'}
    crateType={'normal'}
    popType={'1'}
    pop={'true'}
    crateOwnerImage={item.authorProfileImageURL}
    animation={'animated bounce'}
    />
}

export default CrateList;
