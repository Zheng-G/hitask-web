import React from 'react';
import createBugsnagPlugin from 'bugsnag-react';

const BugsnagErrorBoundary = window.Bugsnag ? window.Bugsnag.use(createBugsnagPlugin(React)) : null;

// class RavenErrorBoundary extends Component {
// 	componentDidCatch = (error) => {
// 		if (window.Raven) {
// 			window.Raven.captureException(error);
// 		}
// 	}
// 	render() {
// 		return this.props.children;
// 	}
// }
// RavenErrorBoundary.propTypes = {
// 	children: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
// };

const emptyComponent = ({ children }) => children;

const ProdErrorBoundary = window.Bugsnag ? BugsnagErrorBoundary : emptyComponent;

const ErrorBoundary = __DEV__ ? require('./DevErrorBoundary').default : ProdErrorBoundary;

export default ErrorBoundary;
