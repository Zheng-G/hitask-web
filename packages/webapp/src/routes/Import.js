import React from 'react';
import Loadable from 'react-loadable';
import LoadingThrobber from '@hitask/components/presentational/LoadingThrobber';

const LoadableImportPage = Loadable({
	loader: () => import('@hitask/components/containers/ImportPageContainer'),
	loading: LoadingThrobber,
});

export default () => <LoadableImportPage />;
