// actions/config.js
import Firebase from 'firebase';
/**
 * Called every time the firebase ref changes
 */
export function replaceConfig(config) {
  return {
    type: 'CONFIG_REPLACE',
    value: config
  };
}

/**
 * Start listening to changes when the app boots
 */
 export function listenToConfigChanges() {
   return (dispatch, getState) => {
     const { firebaseRef } = getState();
     var ref = new Firebase(firebaseRef);

     ref.child('config').on('value', (snapshot) => {
       dispatch(replaceConfig(snapshot.val()));
     });
   };
 }

 /*
  * Save new config data
  */
 export function saveConfig(config) {
   return (dispatch, getState) => {
     const { firebaseRef } = getState();
     var ref = new Firebase(firebaseRef);

     ref.child('config').set(config);
   }
 }


// reducers/config.js
const initialConfigState = {};

export default function config(state = initialConfigState, action) {
  switch (action.type) {
  case 'CONFIG_REPLACE':
    return Object.assign({}, action.value); // note: we replace state entirely here
  default:
    return state;
  }
}
