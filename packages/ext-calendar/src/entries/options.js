import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer as HotContainer } from 'react-hot-loader';
import '@hitask/blueprint-core/dist/blueprint.css';
import '@hitask/styles/global.scss';
import ErrorBoundary from '@hitask/components/presentational/ErrorBoundary';
import ExtOptions from '@hitask/components/containers/ExtOptionsContainer';
import { getLocalState, getInitialState, getMount } from '@hitask/utils/ext-init';
import createStore from '../store/createStore';

window.Promise = require('bluebird');

// ------------------------------
// Render
// ------------------------------
getLocalState().then(localState => {
	const store = createStore(getInitialState(localState));
	const ComposedApp = (
		<HotContainer>
			<ErrorBoundary>
				<Provider store={store}>
					<ExtOptions />
				</Provider>
			</ErrorBoundary>
		</HotContainer>
	);
	ReactDOM.render(ComposedApp, getMount());
});
