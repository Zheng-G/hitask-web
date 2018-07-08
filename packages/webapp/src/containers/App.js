/* eslint react/prefer-stateless-function:0 react/prop-types:0 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import '@hitask/blueprint-core/dist/blueprint.css';
import '@hitask/blueprint-datetime/dist/blueprint-datetime.css';
import '@hitask/blueprint-labs/dist/blueprint-labs.css';
import '@hitask/blueprint-table/dist/table.css';
import '@hitask/styles/global.scss';
import { logRender } from '@hitask/utils/debug';
import Routes from '../routes';

class App extends Component {
	render() {
		const { store, history } = this.props;
		const key = Math.random();
		logRender('render App container');
		return (
			<Provider store={store} key={key}>
				<Router history={history} key={key}>
					<Routes />
				</Router>
			</Provider>
		);
	}
}

export default App;
