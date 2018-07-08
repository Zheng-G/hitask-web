import { connect } from 'react-redux';
import {
	hasSessionSelector,
	getLocalWebappSession,
	selfNameSelector,
	logout,
} from '@hitask/modules/auth';
import { resetModule as resetUserModule, loadPrefs } from '@hitask/modules/user';
import { resetModule as resetItemsModule } from '@hitask/modules/items';
import { resetModule as resetTabsModule } from '@hitask/modules/tabs';
import ExtOptions from '../presentational/ExtOptions';

const mapActionCreators = dispatch => ({
	getLocalWebappSession: () => dispatch(getLocalWebappSession()),
	logout() {
		dispatch(logout()).then(() => {
			dispatch(resetUserModule());
			dispatch(resetItemsModule());
			dispatch(resetTabsModule());
		});
	},
	loadPrefs: () => dispatch(loadPrefs()),
});

const mapStateToProps = state => ({
	hasSession: hasSessionSelector(state),
	userName: selfNameSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ExtOptions);
