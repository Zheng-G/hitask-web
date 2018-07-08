import React from 'react';
import PropTypes from 'prop-types';
import { Button, Intent } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import Dialog from '../Dialog';
import Callout from '../Callout';

const ErrorDialog = ({ isOpen, closeDialog, error }) => {
	let err = error;
	if (!error) err = {};
	let message = err.message || '';
	if (err.response && err.response.errorMessage) {
		message = `${message}. ${err.response.errorMessage}`;
	}
	logRender('render ErrorDialog');
	return (
		<Dialog
			isOpen={isOpen}
			closeDialog={closeDialog}
			mainButton={<Button text="Ok" onClick={closeDialog} />}
		>
			<Callout intent={Intent.DANGER} iconName="warning-sign" title={err.name}>
				{message}
			</Callout>
		</Dialog>
	);
};

const { bool, func, shape } = PropTypes;
ErrorDialog.propTypes = {
	isOpen: bool.isRequired,
	closeDialog: func.isRequired,
	error: shape({}),
};

ErrorDialog.defaultProps = {
	error: {},
};

export default ErrorDialog;
