import React from 'react';
import Loadable from 'react-loadable';
import LoadingThrobber from '@hitask/components/presentational/LoadingThrobber';

const LoadableAuthorizedAppPage = Loadable({
	loader: () => import('@hitask/components/containers/AuthorizedAppContainer'),
	loading: LoadingThrobber,
});

export default () => <LoadableAuthorizedAppPage />;
