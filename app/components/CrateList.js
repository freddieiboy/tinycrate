import React from 'react';
import Crate from './Crate';

var CrateList = React.createClass({
  render: function() {
    var onDelete = this.props.onDelete;
    const { item, index, itemsLength, color} = this.props;
    return <Crate id={item.key} onDelete={onDelete} color={item.crateColor}></Crate>
  }
});

module.exports = CrateList;
