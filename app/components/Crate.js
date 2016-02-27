import React from 'react';

var Crate = React.createClass({
  openCrate: function(event) {
    console.log("opened crate: " + this.props.id);
    openCrate(this.props.id);
  },
  render: function() {
    return (
      <div>
      <img src={'img/crate.png'} className="crate" onClick={this.openCrate}/>
      {this.props.id}
      </div>
    );
  }
});

module.exports = Crate;