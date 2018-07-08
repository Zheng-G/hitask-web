import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import InfoMessageAlert from '../../containers/Alerts/InfoMessageAlertContainer';
import ImportPanel from '../../containers/ImportPanelContainer';
import ImportConfirm from '../../containers/ImportConfirmContainer';
import ImportErrorDialog from '../../containers/Dialogs/ImportErrorDialogContainer';
import ImportSucceedDialog from '../../containers/Dialogs/ImportSucceedDialogContainer';

const PageHead = () => (
	<Helmet>
		<title>{I18n.t(__T('hi.import.page_title.hitask'))}</title>
	</Helmet>
);

const ImportPage = ({ isConfirming }) => (
	<div className="full-height">
		<PageHead />
		{isConfirming ? <ImportConfirm /> : <ImportPanel />}
		<ImportErrorDialog />
		<ImportSucceedDialog />
		<InfoMessageAlert />
	</div>
);

const { bool } = PropTypes;
ImportPage.propTypes = {
	isConfirming: bool,
};

ImportPage.defaultProps = {
	isConfirming: false,
};

export default ImportPage;
