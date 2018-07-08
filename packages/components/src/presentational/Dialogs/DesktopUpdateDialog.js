import React from 'react';
import PropTypes from 'prop-types';
import { Button, Intent } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import Dialog from '../Dialog';
import Callout from '../Callout';

const DesktopUpdateDialog = ({ isOpen, closeDialog, onConfirm }) => {
	logRender('render DesktopUpdateDialog');
	return (
		<Dialog
			isOpen={isOpen}
			closeDialog={closeDialog}
			mainButton={
				<Button
					text="Update"
					intent={Intent.PRIMARY}
					onClick={() => {
						onConfirm();
						closeDialog();
					}}
				/>
			}
			secondaryButton={<Button text="Later" onClick={closeDialog} />}
		>
			<Callout
				intent={Intent.PRIMARY}
				iconName="automatic-updates"
				title="Update is available"
			>
				Restart to update now?
			</Callout>
		</Dialog>
	);
};

const { bool, func } = PropTypes;
DesktopUpdateDialog.propTypes = {
	isOpen: bool.isRequired,
	closeDialog: func.isRequired,
	onConfirm: func.isRequired,
};

export default DesktopUpdateDialog;
