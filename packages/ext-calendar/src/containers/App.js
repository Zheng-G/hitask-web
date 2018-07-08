/* eslint react/prefer-stateless-function:0 react/prop-types:0 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import '@hitask/blueprint-core/dist/blueprint.css';
import '@hitask/blueprint-datetime/dist/blueprint-datetime.css';
import '@hitask/blueprint-labs/dist/blueprint-labs.css';
import '@hitask/styles/global.scss';
import ChromeCalendarExtension from '@hitask/components/containers/ChromeCalendarExtensionContainer';

class App extends Component {
	render() {
		const { store } = this.props;
		return (
			<Provider store={store}>
				<ChromeCalendarExtension />
			</Provider>
		);
	}
}

export default App;
