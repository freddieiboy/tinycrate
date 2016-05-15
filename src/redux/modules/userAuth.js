import Firebase from 'firebase';
import {routerActions} from 'react-router-redux';
import {getName, getUsername, getProfileImageURL} from '../../components/Onboarding/OnboardingUtils'

const fireRef = new Firebase("https://burning-heat-5122.firebaseio.com");
//TODO: read from redux instead!

//NOTE: use this action to listen to auth
export const startListeningToAuth = () => {
	return (dispatch, getState) => {
		fireRef.onAuth((authData) => {
			if (authData) {
				// dispatch cached authData state
				// pass null because we haven't fetched a fresh user from Firebase
				dispatchUserState(dispatch, authData, null);
				// now we fetch the user data from Firebase so it's update to date
				var userRef = fireRef.child('users').child(authData.uid);
				userRef.once('value', (snap) => {
					// dispatch the state again with the newly fetched Firebase user object
					dispatchUserState(dispatch, authData, snap.val());
				});
				//NOTE: Any push from here results in infinite loop.
				// dispatch(routerActions.push('/'));
			} else {
				if (getState().userAuth.currently === 'ANONYMOUS') {
					dispatch({ type: 'LOGOUT' });
				}
			}
		});
	};
}

function dispatchUserState(dispatch, authData, firebaseUserObj) {
	dispatch({
		type: 'LOGIN_USER',
		uid: authData.uid,
		provider: authData.provider,
		// name: getName(authData),
		// username: getUsername(authData),
		// profileImageURL: getProfileImageURL(authData),
		data: authData,
		user: firebaseUserObj
	});
}

//NOTE: use this action to login
export const attemptLogin = (provider) => {
	return (dispatch, getState) => {
		if (provider === 'twitter' || provider === 'facebook') {
			dispatch({ type: 'ATTEMPTING_LOGIN' });
			fireRef.authWithOAuthPopup(provider, (error) => {
				if (error) {
					if (error.code === "TRANSPORT_UNAVAILABLE") {
						fireRef.authWithOAuthRedirect(provider, function(error) {
							dispatch({ type: 'DISPLAY_ERROR', error: 'Login failed! ' + error });
							dispatch({ type: 'LOGOUT' });
						});
					}
				}
			});
		}
	};
}

//NOTE: use this action to logout
export const logoutUser = () => {
	return (dispatch) => {
		dispatch({ type: 'LOGOUT' });
		fireRef.unauth();
	};
}

export const changeProfileColor = (color) => {
	return {
		type: 'CHANGE_PROFILE_COLOR',
    profileColor: color,
	}
}

const initialAuthState = {
  currently: 'ANONYMOUS',
  uid: null,
  provider: null,
	data: null,
	user: null
}

export default function userAuth(state = initialAuthState, action) {
	switch (action.type) {
		case 'ATTEMPTING_LOGIN':
			return {
				currently: 'AWAITING_AUTH_RESPONSE',
				// username: 'guest',
				uid: null
			};
		case 'LOGOUT':
			return {
				currently: 'ANONYMOUS',
				// username: 'guest',
				uid: null
			};
		case 'LOGIN_USER':
			return {
				currently: 'LOGGED_IN',
				// username: action.username,
				uid: action.uid,
        provider: action.provider,
        // name: action.name,
        // profileImageURL: action.profileImageURL,
				data: action.data,
				user: action.user
			};
		case 'CHANGE_PROFILE_COLOR':
			return {
				...state,
				user: {
					...state.user,
					profileColor: action.profileColor
				}
			}
		default: return state;
	}
};
