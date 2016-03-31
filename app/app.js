import React, {Component} from 'react';
import {Router, router} from 'react-router';
import ActionBar from './components/ActionBar';

var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        {this.props.children}
        <ActionBar />
      </div>
    )
  }
})

module.exports = App;
