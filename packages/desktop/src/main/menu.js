import { app, Menu, shell, dialog } from 'electron';
import { DEV, Platforms } from './constants/globals';

const BETA = __ENV__ !== 'production';
const openAboutPopup = () => {
	dialog.showMessageBox({
		type: 'info',
		message: `${BETA ? 'Hitask Beta' : 'Hitask'} ${__APP_VERSION__}`,
		detail: `${new Date(__BUILD_TIMESTAMP__).toLocaleString()}, ${__BUILD_ID__}`,
	});
};

export default class MenuBuilder {
	constructor(mainWindow) {
		this.mainWindow = mainWindow;
	}

	buildMenu() {
		if (DEV) {
			this.setupDevelopmentEnvironment();
		}

		this.setupContextMenu();

		// Romove menu from win
		if (process.platform === Platforms.WIN) {
			return Menu.setApplicationMenu(null);
		}

		let template;
		if (process.platform === Platforms.MAC) {
			template = this.buildDarwinTemplate();
		} else {
			template = this.buildDefaultTemplate();
		}

		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);

		return menu;
	}

	setupDevelopmentEnvironment() {
		this.mainWindow.openDevTools();
	}

	setupContextMenu() {
		this.mainWindow.webContents.on('context-menu', (e, props) => {
			const { x, y, editFlags = {} } = props;
			const { canCut, canCopy, canPaste } = editFlags;
			Menu.buildFromTemplate(
				[
					{
						label: 'Cut',
						role: canCut && 'cut', // rolu mustn't be defined if enabled == false
						enabled: canCut,
					},
					{
						label: 'Copy',
						role: canCopy && 'copy',
						enabled: canCopy,
					},
					{
						label: 'Paste',
						role: canPaste && 'paste',
						enabled: canPaste,
					},
				].concat(
					DEV
						? [
								{
									type: 'separator',
								},
								{
									label: 'Inspect element',
									click: () => this.mainWindow.inspectElement(x, y),
								},
						  ]
						: []
				)
			).popup(this.mainWindow);
		});
	}

	buildDarwinTemplate() {
		const subMenuAbout = {
			label: 'Hitask',
			submenu: [
				{
					label: 'About',
					selector: 'orderFrontStandardAboutPanel:',
					click: openAboutPopup,
				},
				{ type: 'separator' },
				{ label: 'Hide Hitask', accelerator: 'Command+H', selector: 'hide:' },
				{
					label: 'Hide Others',
					accelerator: 'Command+Shift+H',
					selector: 'hideOtherApplications:',
				},
				{ label: 'Show All', selector: 'unhideAllApplications:' },
				{ type: 'separator' },
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click: () => {
						app.quit();
					},
				},
			],
		};

		const subMenuEdit = {
			label: 'Edit',
			submenu: [
				{ label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
				{ label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
				{ type: 'separator' },
				{ label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
				{ label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
				{ label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
				{ label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
			],
		};

		const subMenuView = {
			label: 'View',
			submenu: [
				{
					label: 'Toggle Full Screen',
					accelerator: 'Ctrl+Command+F',
					click: () => {
						this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
					},
				},
			].concat(
				DEV
					? [
							{
								label: 'Reload',
								accelerator: 'Command+R',
								click: () => {
									this.mainWindow.webContents.reload();
								},
							},
							{
								label: 'Toggle Developer Tools',
								accelerator: 'Alt+Command+I',
								click: () => {
									this.mainWindow.toggleDevTools();
								},
							},
					  ]
					: []
			),
		};

		const subMenuWindow = {
			label: 'Window',
			submenu: [
				{ label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
				{ label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
				{ type: 'separator' },
				{ label: 'Bring All to Front', selector: 'arrangeInFront:' },
			],
		};

		const subMenuHelp = {
			label: 'Help',
			submenu: [
				{
					label: 'Hitask Website',
					click() {
						shell.openExternal(__PLAY_APP_BASE_URL__);
					},
				},
				{
					label: 'Help and Guides',
					click() {
						shell.openExternal('http://help.hitask.com/');
					},
				},
				{
					label: 'Community Forum',
					click() {
						shell.openExternal('https://community.hitask.com');
					},
				},
			],
		};

		return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
	}

	buildDefaultTemplate() {
		const templateDefault = [
			{
				label: '&File',
				submenu: [
					{
						label: '&Open',
						accelerator: 'Ctrl+O',
					},
					{
						label: '&Close',
						accelerator: 'Ctrl+W',
						click: () => {
							this.mainWindow.close();
						},
					},
				],
			},
			{
				label: '&View',
				submenu: DEV
					? [
							{
								label: '&Reload',
								accelerator: 'Ctrl+R',
								click: () => {
									this.mainWindow.webContents.reload();
								},
							},
							{
								label: 'Toggle &Full Screen',
								accelerator: 'F11',
								click: () => {
									this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
								},
							},
							{
								label: 'Toggle &Developer Tools',
								accelerator: 'Alt+Ctrl+I',
								click: () => {
									this.mainWindow.toggleDevTools();
								},
							},
					  ]
					: [
							{
								label: 'Toggle &Full Screen',
								accelerator: 'F11',
								click: () => {
									this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
								},
							},
					  ],
			},
			{
				label: 'Help',
				submenu: [
					{
						label: 'Hitask Website',
						click() {
							shell.openExternal('https://hitask.com');
						},
					},
					{
						label: 'Help and Guides',
						click() {
							shell.openExternal('http://help.hitask.com/');
						},
					},
					{
						label: 'Community Forum',
						click() {
							shell.openExternal('https://community.hitask.com');
						},
					},
				],
			},
		];

		return templateDefault;
	}
}
