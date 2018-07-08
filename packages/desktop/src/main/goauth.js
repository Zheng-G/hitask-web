import { ipcMain as ipc } from 'electron';
import log from 'electron-log';
import electronOauth2 from 'electron-oauth2';
import { GOAUTH_REQUEST, GOAUTH_REPLY } from '@hitask/constants/ipcEvents';
import oauthConfig, { tokenRequestOptions } from './goauth.config';
import Raven from './raven';

const windowParams = {
	alwaysOnTop: true,
	autoHideMenuBar: true,
	webPreferences: {
		nodeIntegration: false,
	},
};
const githubOAuth = electronOauth2(oauthConfig, windowParams);

const initGOAuth = Raven.wrap(() => {
	ipc.on(GOAUTH_REQUEST, event => {
		githubOAuth
			.getAccessToken(tokenRequestOptions)
			.then(token => {
				event.sender.send(GOAUTH_REPLY, token);
			})
			.catch(err => {
				log.info('Error while getting GOAuth token');
				log.error(err);
			});
	});
});

export default initGOAuth;
