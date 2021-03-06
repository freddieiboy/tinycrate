import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux';
import * as newCrates from '../redux/modules/NewCrates';

class NotFound extends Component {
  componentDidMount() {
    this.props.actions.hideActionBar();
  }

  render() {
    return (
     <div className="404">
       <h1>404 Your page does not exist!</h1>
     </div>
   )
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  actions: bindActionCreators(Object.assign({}, newCrates, routerActions), dispatch)
})

export default connect(null, mapDispatchToProps)(NotFound)
