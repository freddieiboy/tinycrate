import React from 'react';
import Crate from './Crate';

var CrateList = React.createClass({
  render: function() {
    var onDelete = this.props.onDelete;
    var crateNodes = this.props.data.map(function(crate) {
      return (
        <Crate id={crate.key} onDelete={onDelete}>
        </Crate>
      );
    });
    return (
      <div className="crateList" style={{padding: '15px'}}>
        {crateNodes}
      </div>
    );
  }
});


module.exports = CrateList;
