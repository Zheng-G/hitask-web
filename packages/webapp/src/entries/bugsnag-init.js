import bugsnag from 'bugsnag-js';

const Bugsnag = bugsnag({
	apiKey: __BUGSNAG_API_KEY__,
	appVersion: __APP_VERSION__,
	releaseStage: __ENV__,
});

window.Bugsnag = Bugsnag;
