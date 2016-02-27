import React from 'react';

var Crate = React.createClass({
  openCrate: function(event) {
    console.log("opened crate: " + this.props.id);
    openCrate(this.props.id);
  },
  render: function() {
    return (
      <div>
        <div className="crate-holder" onClick={this.openCrate}>
          <div className="crate-top"></div>
          <div className="crate-bottom"></div>
          <div className="crate-shadow"></div>
        </div>

        {this.props.id}
        
      </div>
    );
  }
});

module.exports = Crate;
