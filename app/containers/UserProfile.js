// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import UserProfile from '../components/UserProfile';
import * as uiActions from '../actions/ui';
import * as authActions from '../actions/auth';
import * as userActions from '../actions/user';


function mapStateToProps(state) {
  return {
    user: state.user,
    offline: state.ui.offline,
    displayedTab: state.ui.displayedTab,
    buttonSpinnerActive: state.ui.buttonSpinnerActive
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, authActions, userActions, uiActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);