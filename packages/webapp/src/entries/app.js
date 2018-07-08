import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotContainer } from 'react-hot-loader';
import createHistory from 'history/createBrowserHistory';
import ErrorBoundary from '@hitask/components/presentational/ErrorBoundary';
import { getLocalSessionSync } from '@hitask/modules/auth';
import createStore from '../store/createStore';

const bluebird = require('bluebird');

window.Promise = bluebird;
bluebird.config({
	longStackTraces: __DEV__,
	warnings: false,
});

if (__DEV__ && __PERF_ANALYZER__) {
	const { registerObserver } = require('react-perf-devtool'); // eslint-disable-line global-require
	registerObserver({
		shouldLog: true,
		port: 3006,
		components: ['Item'],
	});

	const { whyDidYouUpdate } = require('why-did-you-update'); // eslint-disable-line global-require
	whyDidYouUpdate(React);
}

// ------------------------------
// Store
// ------------------------------
const initialState = {
	auth: {
		session: getLocalSessionSync(),
	},
};
const history = createHistory();
const store = createStore(initialState, history);

// ------------------------------
// Render
// ------------------------------
const composeApp = App => (
	<HotContainer key={Math.random()}>
		<ErrorBoundary>
			<App store={store} history={history} />
		</ErrorBoundary>
	</HotContainer>
);

const renderApp = () => {
	const App = require('../containers/App').default; // eslint-disable-line global-require
	ReactDOM.render(composeApp(App), document.getElementById('reactRoot'));
};

renderApp();

if (module.hot) {
	module.hot.accept('../containers/App', renderApp);
}
