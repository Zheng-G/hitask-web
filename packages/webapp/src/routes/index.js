import React from 'react';
import { Switch, Route } from 'react-router';
import CoreLayout from '@hitask/components/containers/CoreLayoutContainer';
import ProtectedRoute from '@hitask/components/containers/ProtectedRouteContainer';
import UnauthRoute from '@hitask/components/containers/UnauthRouteContainer';
import NotFoundPage from '@hitask/components/presentational/NotFoundPage';
import { logRender } from '@hitask/utils/debug';
import { Routes } from '@hitask/constants/layout';
import LoginPage from './Login';
import AppPage from './AuthorizedApp';
import SettingsPage from './Settings';
import ImportPage from './Import';
// import ArchivePage from './Archive';

const RoutesConfig = () => {
	logRender('render routes');
	return (
		<CoreLayout>
			<Switch>
				<ProtectedRoute exact path={Routes.APP} component={AppPage} />
				<UnauthRoute path={Routes.LOGIN} component={LoginPage} />
				{__ENABLE_SETTINGS__ && (
					<ProtectedRoute path={Routes.SETTINGS} component={SettingsPage} />
				)}
				{__ENABLE_IMPORT__ && (
					<ProtectedRoute path={Routes.IMPORT} component={ImportPage} />
				)}
				{/* <ProtectedRoute path={Routes.ARCHIVE} component={ArchivePage} /> */}
				<Route component={NotFoundPage} />
			</Switch>
		</CoreLayout>
	);
};

export default RoutesConfig;
