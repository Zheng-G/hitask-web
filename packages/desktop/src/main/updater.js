import { ipcMain as ipc } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { APP_UPDATER_READY, APP_UPDATE_READY } from '@hitask/constants/ipcEvents';
import { PROD } from './constants/globals';
import Raven from './raven';

const updatesCheckInterval = __ENV__ === 'production' ? 1000 * 60 * 60 * 12 : 1000 * 60 * 10;
const DEV_DEBUG_UPDATER = false;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

const updatesCheck = Raven.wrap(mainWindow => {
	if (PROD) {
		autoUpdater.checkForUpdates();
	} else if (DEV_DEBUG_UPDATER) {
		log.info('Checking updates...');
		mainWindow.webContents.send(APP_UPDATE_READY);
	}
});

Raven.context(() => {
	autoUpdater.on('checking-for-update', () => {
		log.info('Checking for update...');
	});

	autoUpdater.on('update-available', (ev, info) => {
		log.info('Update available.');
		if (info) log.info(info);
	});

	autoUpdater.on('update-not-available', (ev, info) => {
		log.info('Update not available.');
		if (info) log.info(info);
	});

	autoUpdater.on('error', () => {
		log.info('Error in auto-updater.');
	});

	autoUpdater.on('download-progress', (ev, progressObj) => {
		log.info('Download progress...');
		if (progressObj) log.info(progressObj);
	});
});

export const initUpdater = Raven.wrap(mainWindow => {
	ipc.on(APP_UPDATER_READY, () => {
		// Check for app updates
		log.info('Renderer updater is ready');
		updatesCheck(mainWindow);
		setInterval(() => updatesCheck(mainWindow), updatesCheckInterval);
	});

	autoUpdater.on('update-downloaded', (ev, info) => {
		log.info('Update downloaded. Show user dialog');
		if (info) log.info(info);
		mainWindow.webContents.send(APP_UPDATE_READY);
	});
});

export default autoUpdater;
