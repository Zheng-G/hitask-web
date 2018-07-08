/* eslint global-require:0, flowtype-errors/show-errors:0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 */
import { app, protocol, shell, BrowserWindow, ipcMain as ipc } from 'electron';
import log from 'electron-log';
import Config from 'electron-config';
import {
	APP_UPDATE_CONFIRM,
	SET_BADGE_COUNT,
	TRACK_USER,
	GET_LOCAL_SESSION,
	SET_LOCAL_SESSION,
} from '@hitask/constants/ipcEvents';
import { PROD, Platforms } from './constants/globals';
import Raven from './raven';
import MenuBuilder from './menu';
import autoUpdater, { initUpdater } from './updater';
import initGOAuth from './goauth';
import paths from './resolver';
import { convertAbsolutePath } from './utils';

Raven.context(() => {
	const Storage = new Config();
	const URL = `file://${paths.base('index.html')}`;
	let forceQuit = false;
	let mainWindow = null;

	const installExtensions = async () => {
		const installer = require('electron-devtools-installer');
		const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
		const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

		return Promise.all(
			extensions.map(name => installer.default(installer[name], forceDownload))
		).catch(log.error);
	};

	require('source-map-support').install();

	if (__DEV__ || __DEBUG_PROD__) {
		require('electron-debug')({
			enabled: true,
			showDevTools: 'undocked',
		});
	}

	// ------------------------------
	// Event listeners
	// ------------------------------
	app.on('ready', async () => {
		// Fix relative file paths, query params etc
		protocol.interceptFileProtocol(
			'file',
			(request, callback) => {
				const filePath = request.url.substr(7);
				const modifiedPath = convertAbsolutePath(filePath);
				callback({ path: modifiedPath });
			},
			error => {
				if (!error) return;
				log.info('Failed to register protocol');
				log.error(error);
			}
		);

		// Install react & redux devtools
		if (__DEV__ || __DEBUG_PROD__) {
			await installExtensions();
		}

		// Setup window sizes
		const windowBounds = Storage.get('windowBounds');
		mainWindow = new BrowserWindow({
			width: 800,
			height: 700,
			...windowBounds,
			show: false,
			minWidth: 800,
			minHeight: 700,
		});

		// Load main page
		mainWindow.loadURL(URL);

		// Use 'ready-to-show' event
		// https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
		mainWindow.webContents.on('did-finish-load', () => {
			if (!mainWindow) {
				throw new Error('"mainWindow" is not defined');
			}
			mainWindow.show();
			mainWindow.focus();
		});

		// Updater setup
		initUpdater(mainWindow);
		ipc.on(APP_UPDATE_CONFIRM, () => {
			if (PROD) {
				forceQuit = true;
				autoUpdater.quitAndInstall();
			} else {
				log.info('App updated');
			}
		});

		// Track authorized user in bug tracker
		ipc.on(TRACK_USER, (event, user) => {
			Raven.setContext({
				user: {
					id: user.userId,
					name: user.userName,
					email: user.userEmail,
				},
			});
		});

		ipc.on(GET_LOCAL_SESSION, event => {
			event.returnValue = Storage.get('session') || null;
		});

		ipc.on(SET_LOCAL_SESSION, (event, session) => {
			if (session) {
				Storage.set('session', session);
			} else {
				Storage.delete('session');
			}
		});

		ipc.on(SET_BADGE_COUNT, (event, count) => {
			app.setBadgeCount(count);
		});

		// Setup Google OAuth2
		initGOAuth();

		// Open links with target="_blank" in default browser
		mainWindow.webContents.on('new-window', (event, url) => {
			event.preventDefault();
			shell.openExternal(url);
		});

		mainWindow.on('close', event => {
			Storage.set('windowBounds', mainWindow.getBounds());
			if (process.platform === Platforms.MAC && !forceQuit) {
				event.preventDefault();
				mainWindow.hide();
			}
		});

		mainWindow.on('closed', () => {
			mainWindow = null;
		});

		const menuBuilder = new MenuBuilder(mainWindow);
		menuBuilder.buildMenu();
	});

	app.on('before-quit', () => {
		forceQuit = true;
	});

	app.on('window-all-closed', () => {
		// Respect the OSX convention of having the application in memory even
		// after all windows have been closed
		if (process.platform !== Platforms.MAC) {
			app.quit();
		}
	});

	app.on('activate', () => {
		mainWindow.show();
		mainWindow.focus();
	});
});
