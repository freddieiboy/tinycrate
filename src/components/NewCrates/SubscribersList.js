import React, {Component} from 'react';
import Subscriber from 'components/NewCrates/Subscriber';
import $ from 'jquery';

class SubscribersList extends Component {
  render() {
    let {subscribers} = this.props;
    const arr = $.makeArray(subscribers);
    const subNodes = $.map(arr, (val, key) => {
      return <Subscriber newGifteeAction={this.props.newGifteeAction} key={key} name={val.name} username={val.username} storeSubs={subscribers}/>
    });
    return (
      <div className="SubscribersList">
        {subNodes}
      </div>
    )
  }
}

export default SubscribersList;
