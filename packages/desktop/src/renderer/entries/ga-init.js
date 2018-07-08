import Analytics from 'electron-google-analytics';
import uuid from 'uuid';

class DesktopAnalytics extends Analytics {
	constructor() {
		super(__GA_TRACK_ID__);
		this.CLIENT_ID = uuid();
		this.APP_NAME = `Desktop-${__ENV__}`;
		this.APP_ID = __APP_ID__;
		this.APP_VERSION = __APP_VERSION__;
	}

	pageview(pageName, pageTitle) {
		return super
			.pageview(__NODE_APP_BASE_URL__, pageName, pageTitle, this.CLIENT_ID)
			.catch(console.error);
	}

	screen(screenName) {
		return super
			.screen(
				this.APP_NAME,
				this.APP_VERSION,
				this.APP_ID,
				/* appInstallerID */ undefined,
				screenName,
				this.CLIENT_ID
			)
			.catch(console.error);
	}
}

window.manualGAnalytics = new DesktopAnalytics();
