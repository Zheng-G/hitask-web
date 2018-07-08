import { connect } from 'react-redux';
import { selfProfileSelector, accountTypeSelector } from '@hitask/modules/auth';
import { isExtension, isElectron } from '@hitask/utils/helpers';
import { TRACK_USER } from '@hitask/constants/ipcEvents';

const ipc = window.ipc;
const mapActionCreators = () => ({
	trackUser({ userId, userName, userEmail, accountType }) {
		if (!userId) return; // Not authorized
		if (window.Bugsnag) {
			window.Bugsnag.user = {
				id: userId,
				name: userName,
				email: userEmail,
			};
		}
		if (window.Raven) {
			window.Raven.setUserContext({
				id: userId,
				name: userName,
				email: userEmail,
			});
		}
		if (window.Intercom) {
			window.Intercom(window.Intercom.booted ? 'update' : 'boot', {
				app_id: __INTERCOM_APP_ID__,
				user_id: userId,
				name: userName,
				email: userEmail,
				plan: accountType ? accountType.toLowerCase() : null,
			});
			if (!isExtension) {
				window.Intercom('trackEvent', isElectron ? 'desktop' : 'web-app');
			}
		}
		if (ipc) {
			ipc.send(TRACK_USER, {
				userId,
				userName,
				userEmail,
			});
		}
	},
});

const mapStateToProps = state => {
	const user = selfProfileSelector(state);
	return {
		userId: user ? user.id : null,
		userName: user ? user.name : null,
		userEmail: user ? user.email : null,
		accountType: accountTypeSelector(state),
	};
};

export default component => connect(mapStateToProps, mapActionCreators)(component);
