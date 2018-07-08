import React from 'react';
import Loadable from 'react-loadable';
import LoadingThrobber from '@hitask/components/presentational/LoadingThrobber';

const LoadableSettingsPage = Loadable({
	loader: () => import('@hitask/components/presentational/SettingsPage'),
	loading: LoadingThrobber,
});

export default () => <LoadableSettingsPage />;
