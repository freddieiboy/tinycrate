
// actions/firebaseRef.js

export function setFirebaseRef(url) {
  return {
    type: 'FIREBASE_REF_SET',
    value: url
  };
}
// reducers/firebaseRef.js
const initialRefState = null;

export default function firebaseRef(state = initialRefState, action) {
  switch (action.type) {
  case 'FIREBASE_REF_SET':
    return action.value;
  default:
    return state;
  }
}
