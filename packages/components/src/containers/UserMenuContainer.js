import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { logout } from '@hitask/modules/auth';
import { resetModule as resetUserModule } from '@hitask/modules/user';
import { resetModule as resetItemsModule } from '@hitask/modules/items';
import { resetModule as resetTabsModule } from '@hitask/modules/tabs';
import { Routes } from '@hitask/constants/layout';
import UserMenu from '../presentational/UserMenu';

const mapActionCreators = dispatch => ({
	settingsClick() {
		dispatch(push(Routes.SETTINGS));
	},
	importClick() {
		dispatch(push(Routes.IMPORT));
	},
	logoutClick() {
		dispatch(logout()).then(() => {
			dispatch(resetUserModule());
			dispatch(resetItemsModule());
			dispatch(resetTabsModule());
		});
	},
});

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapActionCreators)(UserMenu);
