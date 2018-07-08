import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { logRender } from '@hitask/utils/debug';
import Alert from '../Alert';

const InfoMessageAlert = ({ isOpen, title, message, closeAlert, onClose }) => {
	logRender('render InfoMessageAlert');
	return (
		<Alert
			isOpen={isOpen}
			onConfirm={() => {
				closeAlert();
				onClose();
			}}
			confirmButtonText={I18n.t(__T('js.task.button.close'))}
		>
			<div>
				{title && <h6>{title}</h6>}
				{message}
			</div>
		</Alert>
	);
};

const { bool, func, string } = PropTypes;
InfoMessageAlert.propTypes = {
	isOpen: bool.isRequired,
	title: string,
	message: string,
	closeAlert: func.isRequired,
	onClose: func,
};

const emptyFunc = () => {};
InfoMessageAlert.defaultProps = {
	title: null,
	message: null,
	onClose: emptyFunc,
};

export default InfoMessageAlert;
