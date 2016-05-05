/* @flow */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
// import { increment, doubleAsync } from '../../redux/modules/counter'
import DuckImage from './Duck.jpg'
import classes from './HomeView.scss'
import { browserHistory } from 'react-router'
import { push } from 'react-router-redux'
import * as counter from '../../redux/modules/counter';
import { bindActionCreators } from 'redux'

// We can use Flow (http://flowtype.org/) to type our component's props
// and state. For convenience we've included both regular propTypes and
// Flow types, but if you want to try just using Flow you'll want to
// disable the eslint rule `react/prop-types`.
// NOTE: You can run `npm run flow:check` to check for any errors in your
// code, or `npm i -g flow-bin` to have access to the binary globally.
// Sorry Windows users :(.


// We avoid using the `@connect` decorator on the class definition so
// that we can export the undecorated component for testing.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
export class HomeView extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div className='container text-center'>
        <div className='row'>
          <div className='col-xs-2 col-xs-offset-5'>
            <img className={classes.duck}
              src={DuckImage}
              alt='This is a duck, because Redux.' />
          </div>
        </div>
        <h1>Welcome to the React Redux Starter Kit</h1>
        <h2>
          Sample Counter:
          {' '}
          <span className={classes['counter--green']}>{this.props.store.counter}</span>
        </h2>
        {/*<div className={classes.foo}>*/}
        <div className="foo">
          <button className='btn btn-default' onClick={this.props.actions.increment}>
            increment
          </button>
        </div>
        {' '}
        <button className='btn btn-default' onClick={this.props.actions.doubleAsync}>
          Double (Async)
        </button>
        <button className='btn btn-primary' onClick={() => this.props.dispatch(push('corgi'))}>
          Going Places
        </button>
      </div>
    )
  }
}

// HomeView.propTypes = {
//   counter: PropTypes.number.isRequired,
//   doubleAsync: PropTypes.func.isRequired,
//   increment: PropTypes.func.isRequired
// };

HomeView.contextTypes = {
  router: PropTypes.object
}

const mapStateToProps = (state) => ({
  store: {
    counter: state.counter
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(counter, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
