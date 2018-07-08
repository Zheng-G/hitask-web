import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotContainer } from 'react-hot-loader';
import ErrorBoundary from '@hitask/components/presentational/ErrorBoundary';
import { getLocalState, getInitialState, getMount } from '@hitask/utils/ext-init';
import createStore from '../store/createStore';
import App from '../containers/App';

const bluebird = require('bluebird');

window.Promise = bluebird;
bluebird.config({
	longStackTraces: __DEV__,
	warnings: false,
});

// ------------------------------
// Render
// ------------------------------
const renderApp = (AppComponent, store) => {
	const ComposedApp = (
		<HotContainer key={Math.random()}>
			<ErrorBoundary>
				<AppComponent store={store} />
			</ErrorBoundary>
		</HotContainer>
	);
	ReactDOM.render(ComposedApp, getMount());
};

getLocalState().then(localState => {
	const store = createStore(getInitialState(localState));
	renderApp(App, store);

	if (module.hot) {
		module.hot.accept('../containers/App', () => {
			const nextApp = require('../containers/App').default; // eslint-disable-line global-require
			renderApp(nextApp, store);
		});
	}
});
