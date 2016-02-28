import React from 'react';
import classNames from 'classnames';
import mojs from 'mo-js';

var Crate = React.createClass({
  getInitialState: function() {
    return {
      isPressed: false,
      popping: false
    }
  },
  pop: function() {
    this.setupPop()
  },
  crateClick: function(event) {
    console.log("opened crate: " + this.props.id);
    openCrate(this.props.id);
  },
  deleteObj: function(event) {
    var itself = this;
    console.log("create delete");
    var FIREBASE_URL = "https://crackling-fire-5975.firebaseio.com";
    var crate = new Firebase(FIREBASE_URL + "/crates/" + this.props.id);
    crate.update({
      "opened": true
    }, function(error) {
      if (error) {
        console.log("Data could not be saved." + error);
      } else {
        console.log("Data saved successfully.");
        itself.setState({popping: true})
        itself.pop()

        setTimeout(function() {
          itself.setState({popping: false})
          itself.setState({isPressed: false})
          itself.props.onDelete(itself.props.id);
        }, 700);
      }
    });
  },
  setupPop: function() {
		var el = this.refs.thisCrate,
			// mo.js timeline obj
			timeline = new mojs.Timeline(),

			// tweens for the animation:

			// burst animation
			tween1 = new mojs.Burst({
				parent: el,
				duration: 1500,
				shape : 'circle',
				fill : [ '#988ADE', '#DE8AA0', '#8AAEDE', '#8ADEAD', '#DEC58A', '#8AD1DE' ],
				x: '50%',
				y: '50%',
				opacity: 0.6,
				childOptions: { radius: {20:0} },
				radius: {40:120},
				count: 6,
				isSwirl: true,
				isRunLess: true,
				easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
			}),
			// ring animation
			tween2 = new mojs.Transit({
				parent: el,
				duration: 750,
				type: 'circle',
				radius: {0: 50},
				fill: 'transparent',
				stroke: '#988ADE',
				strokeWidth: {15:0},
				opacity: 0.6,
				x: '50%',
				y: '50%',
				isRunLess: true,
				easing: mojs.easing.bezier(0, 1, 0.5, 1)
			}),
			// icon scale animation
			tween3 = new mojs.Tween({
				duration : 700,
				onUpdate: function(progress) {
				}
			});

		timeline.add(tween1, tween2, tween3);

		return timeline.start()
	},
  pressCrate: function() {
    this.setState({isPressed: true})
  },
  render: function() {
    var crateTop = classNames({
      'crate-top': !this.state.isPressed,
      'crate-top-pressed': this.state.isPressed,
      'popping': this.state.popping
    });
    var crateBottom = classNames({
      'crate-bottom': !this.state.isPressed,
      'crate-bottom-pressed': this.state.isPressed,
      'popping': this.state.popping

    });
    var crateShadow = classNames({
      'crate-shadow': !this.state.isPressed,
      'crate-shadow-pressed': this.state.isPressed,
      'popping': this.state.popping
    });
console.log(this.state.isPressed);
    return (
      <div>
        <div className="crate-holder animated bounce" ref="thisCrate" onMouseDown={this.pressCrate} onTouchEnd={this.deleteObj} onTouchStart={this.pressCrate}>
          <div className={crateTop}></div>
          <div className={crateBottom}></div>
          <div className={crateShadow}></div>
        </div>
      </div>
    );
  }
});



module.exports = Crate;
