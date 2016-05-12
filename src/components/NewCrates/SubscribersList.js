import React, {Component} from 'react';
import Subscriber from 'components/NewCrates/Subscriber';
import $ from 'jquery';

class SubscribersList extends Component {
  render() {
    let {subscribers, newGifteeAction, removeGifteeAction, myProfileColor} = this.props;
    const arr = $.makeArray(subscribers);
    const subNodes = $.map(arr, (val, key) => {
      return <Subscriber
        newGifteeAction={newGifteeAction}
        key={key}
        id={key}
        name={val.name}
        username={val.username}
        storeSubs={subscribers}
        removeGifteeAction={removeGifteeAction}
        thisSubscriberColor={val.profileColor}
        myProfileColor={myProfileColor}/>
    });
    return (
      <div className="SubscribersList scroll full-width">
        {subNodes}
      </div>
    )
  }
}

export default SubscribersList;
