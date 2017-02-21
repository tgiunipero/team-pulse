// @flow
import Immutable from 'seamless-immutable';
import { authActionTypes } from '../actions/auth';

const initialState = Immutable({});

const userReducer = (
  state: {
    // eslint-disable-next-line flowtype/no-weak-types
    merge: Function
  } = initialState,
  action: {
    type: string,
    user?: {
      uid: string,
      email: string,
      photoURL?: string,
      displayName?: string,
      emailVerified: boolean
    },
    error?: {}
  }
) => {
  switch (action.type) {
    case authActionTypes.LOGIN_START:
      return state;

    case authActionTypes.LOGIN_SUCCESS:
      if (!action.user) return state;

      return state.merge({
        // subset of firebase' response
        uid: action.user.uid,
        name: action.user.displayName,
        email: action.user.email,
        photoUrl: action.user.photoURL,
        emailVerified: action.user.emailVerified
      });

    case authActionTypes.LOGIN_ERROR:
      console.error(action.error);

      // Handle Errors here.
      // var errorCode = action.error.code;
      // var errorMessage = action.error.message;
      // if (errorCode === 'auth/wrong-password') {
      //   alert('Wrong password.');
      // } else {
      //   alert(errorMessage);
      // }

      return state;

    case authActionTypes.LOGOUT_START:
      return state;

    case authActionTypes.LOGOUT_SUCCESS:
      return Immutable.replace(state, {});

    case authActionTypes.LOGOUT_ERROR:
      console.error(action.error);
      return state;

    default:
      return state;
  }
};

export { userReducer as default };
