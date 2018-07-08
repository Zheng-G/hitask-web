/* eslint react/prefer-stateless-function:0 react/prop-types:0 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import '@hitask/blueprint-core/dist/blueprint.css';
import '@hitask/blueprint-datetime/dist/blueprint-datetime.css';
import '@hitask/blueprint-labs/dist/blueprint-labs.css';
import '@hitask/styles/global.scss';
import { logRender } from '@hitask/utils/debug';
import ChromeAppExtension from '@hitask/components/containers/ChromeAppExtensionContainer';

class App extends Component {
	render() {
		const { store } = this.props;
		const key = Math.random();
		logRender('render App container');
		return (
			<Provider store={store} key={key}>
				<ChromeAppExtension />
			</Provider>
		);
	}
}

export default App;
