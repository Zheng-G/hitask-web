/* eslint react/prop-types:0 */
import React, { Component } from 'react';
import RedBox from 'redbox-react';

class DevErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
		};
		this.setError = this.setError.bind(this);
		window.addEventListener('unhandledrejection', this.setError);
	}

	setError(error) {
		this.setState({
			error,
		});
	}

	componentDidCatch(error) {
		this.setError(error);
	}

	render() {
		if (this.state.error) {
			return <RedBox error={this.state.error} />;
		}
		return this.props.children;
	}
}

export default DevErrorBoundary;
