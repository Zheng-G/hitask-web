import React from 'react';
import { Provider } from 'react-redux';
import { configure, addDecorator } from '@storybook/react';
import { FocusStyleManager } from '@hitask/blueprint-core';
import '@hitask/blueprint-core/dist/blueprint.css';
import '@hitask/blueprint-datetime/dist/blueprint-datetime.css';
import '@hitask/blueprint-labs/dist/blueprint-labs.css';
import '@hitask/styles/global.scss';
import './styles.scss';
import createStore from './store/createStore';

FocusStyleManager.onlyShowFocusOnTabs();

const req = require.context('@hitask/components/presentational', true, /\.stories\.js$/);
const store = createStore();

addDecorator(story => (
	<Provider store={store}>
		<div className="storiesContainer">{story()}</div>
	</Provider>
));

function loadStories() {
	req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
