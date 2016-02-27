import React from 'react';
import Crate from './Crate';

var CrateList = React.createClass({
  render: function() {
    var crateNodes = this.props.data.map(function(crate) {
      return (
        <Crate name={crate.crate} id={crate.id}>
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
