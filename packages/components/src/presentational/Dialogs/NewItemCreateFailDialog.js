import React from 'react';
import PropTypes from 'prop-types';
import { Button, Intent } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import Dialog from '../Dialog';
import Callout from '../Callout';

const NewItemCreateFailDialog = ({ isOpen, closeDialog, error }) => {
	logRender('render NewItemCreateFailDialog');
	return (
		<Dialog
			isOpen={isOpen}
			closeDialog={closeDialog}
			mainButton={<Button text="Ok" onClick={closeDialog} />}
		>
			<Callout
				intent={Intent.DANGER}
				iconName="warning-sign"
				title="Oops. There was a problem saving the item. Please try again."
			>
				{error && error.message}
				<br />
				{error && error.response && error.response.error_message}
			</Callout>
		</Dialog>
	);
};

const { bool, func, object, oneOfType } = PropTypes;
NewItemCreateFailDialog.propTypes = {
	isOpen: bool.isRequired,
	closeDialog: func.isRequired,
	error: oneOfType([object]),
};

NewItemCreateFailDialog.defaultProps = {
	error: null,
};

export default NewItemCreateFailDialog;
