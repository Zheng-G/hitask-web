import React from 'react';
import Loadable from 'react-loadable';
import LoadingThrobber from '@hitask/components/presentational/LoadingThrobber';

const LoadableArchivePage = Loadable({
	loader: () => import('@hitask/components/presentational/ArchivePage'),
	loading: LoadingThrobber,
});

export default () => <LoadableArchivePage />;
