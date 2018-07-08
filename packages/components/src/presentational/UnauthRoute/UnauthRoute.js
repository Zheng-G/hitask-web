import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
import { DEFAULT_ROUTE } from '@hitask/constants/layout';

const UnauthRoute = ({ hasSession, component: Component, location, ...rest }) => {
	const nextPath =
		location.state && location.state.from && location.state.from.pathname !== '/login'
			? location.state.from.pathname
			: DEFAULT_ROUTE;
	return (
		<Route
			{...rest}
			render={props =>
				hasSession ? (
					<Redirect
						to={{
							pathname: nextPath,
							state: { from: props.location },
						}}
					/>
				) : (
					<Component {...props} />
				)
			}
		/>
	);
};

const { bool, element, object, oneOfType, func } = PropTypes;
UnauthRoute.propTypes = {
	hasSession: bool.isRequired,
	location: oneOfType([object]).isRequired,
	component: oneOfType([element, func]).isRequired,
};

export default UnauthRoute;
