import { connect } from 'react-redux';
import { loginExternal } from '@hitask/modules/auth';
import { GOAUTH_REQUEST, GOAUTH_REPLY } from '@hitask/constants/ipcEvents';

const ipc = window.ipc;
const mapActionCreators = dispatch => ({
	onLoginReady() {
		if (!ipc) return;
		ipc.on(GOAUTH_REPLY, (e, token) => {
			dispatch(loginExternal(token));
		});
	},
	requestGOAuthToken() {
		if (!ipc) return;
		ipc.send(GOAUTH_REQUEST);
	},
});

const mapStateToProps = () => ({});

export default component => connect(mapStateToProps, mapActionCreators)(component);
