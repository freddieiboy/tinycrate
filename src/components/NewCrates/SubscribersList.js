import React, {Component} from 'react';
import Subscriber from 'components/NewCrates/Subscriber';
import $ from 'jquery';

class SubscribersList extends Component {
  render() {
    let {subscribers} = this.props;
    const arr = $.makeArray(subscribers);
    const subNodes = $.map(arr, (val, key) => {
      return <Subscriber newGiftee={this.props.newGiftee} key={key} name={val.name} username={val.username}/>
    });
    return (
      <div className="SubscribersList">
        {subNodes}
      </div>
    )
  }
}

export default SubscribersList;
