import React from 'react';
import PropTypes from 'prop-types';
import { Button, Intent } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import Dialog from '../Dialog';
import Callout from '../Callout';

const NewItemCreateSuccessDialog = ({ isOpen, closeDialog }) => {
	logRender('render NewItemCreateSuccessDialog');
	return (
		<Dialog
			isOpen={isOpen}
			closeDialog={closeDialog}
			secondaryButton={<Button text="Close" />}
			mainButton={<Button text="Add another" intent={Intent.PRIMARY} onClick={closeDialog} />}
		>
			<Callout intent={Intent.SUCCESS} title="Item added" />
		</Dialog>
	);
};

const { bool, func } = PropTypes;
NewItemCreateSuccessDialog.propTypes = {
	isOpen: bool.isRequired,
	closeDialog: func.isRequired,
};

export default NewItemCreateSuccessDialog;
