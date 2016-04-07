// import React, {Component, PropTypes} from 'react';
// import Autocomplete from 'react-autocomplete';
// import { Notification } from 'react-notification';
// import $ from 'jquery';
// import FilePicker from 'component-file-picker';
// import ActionBar from './ActionBar';
// import Hammer from 'react-hammerjs';
// import {Motion, spring} from 'react-motion';
// import CrateTemplate from './Crates/CrateTemplate';
// import {Emojis} from './Emojis';
//
// import { bindActionCreators } from 'redux';
// import {connect} from 'react-redux';
// import * as ActionBarActions from '../redux/modules/ActionBarRedux';
//
// // var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
// // var ref = new Firebase(FIREBASE_URL);
// // var authData = ref.getAuth();
// // var userRef = ref.child('users').child(authData.uid);
// // var user;
//
// // const itself = this;
//
// const CreatePage = ({ isOpened }) => {
//
//   const styles = {
//     item: {
//       padding: '2px 6px',
//       cursor: 'default'
//     },
//     highlightedItem: {
//       color: 'white',
//       background: 'hsl(200, 50%, 50%)',
//       padding: '2px 6px',
//       cursor: 'default'
//     },
//     menu: {
//       border: 'solid 1px #ccc'
//     }
//   }
//   return (
//     <div>
//       <div >
//         <div className="container-fluid body-content-create">
//           {isOpened ? (
//             <CrateTemplate color={'green'} crateSize={80} pop={true}/>
//           ) : (
//             "Dude"
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
//
// // <Motion style={this.loaded()}>
// //   {({opacity}) =>
// //     <div style={{opacity: opacity}}>
// //       <div className="container-fluid body-content-create">
// //         <CrateTemplate color={'green'} crateSize={80} pop={true}/>
// //       </div>
// //     </div>}
// // </Motion>
//
// // const incrementGiftedCount = () => {
// //   userRef.child("giftedCount").transaction((giftedCount) => {
// //     if(giftedCount === null) {
// //       return 1;
// //     }
// //     return giftedCount + 1;
// //   });
// // }
// //
// // const updateRecentGiftees = (giftee) => {
// //   userRef.child("giftees").child(giftee.uid).transaction((giftee) => {
// //     return {
// //       giftedAt: Firebase.ServerValue.TIMESTAMP
// //     };
// //   });
// // }
//
// CreatePage.PropTypes = {
//   isOpened: PropTypes.bool.isRequired,
//   openActionBar: PropTypes.func.isRequired,
//   closeActionBar: PropTypes.func.isRequired,
// }
//
// const mapStateToProps = (state) => ({
//   store: {
//     isOpened: state.ActionBarRedux.isOpened,
//     userAuth: state.userAuth
//   }
// })
//
// const mapDispatchToProps = (dispatch) => ({
//   dispatch,
//   actions: bindActionCreators(ActionBarActions, dispatch)
// })
//
// export default connect(mapStateToProps, mapDispatchToProps)(CreatePage)
