import React from 'react';
import PropTypes from 'prop-types';
import { Dialog as BpDialog, Classes } from '@hitask/blueprint-core';

const Dialog = ({ isOpen, closeDialog, mainButton, secondaryButton, children, ...dialogProps }) => (
	<BpDialog isOpen={isOpen} onClose={closeDialog} {...dialogProps}>
		<div className={Classes.DIALOG_BODY}>{children}</div>
		{mainButton || secondaryButton ? (
			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					{mainButton}
					{secondaryButton}
				</div>
			</div>
		) : null}
	</BpDialog>
);

const { bool, any, func, element } = PropTypes;
Dialog.propTypes = {
	isOpen: bool.isRequired,
	closeDialog: func.isRequired,
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
	mainButton: element,
	secondaryButton: element,
};

Dialog.defaultProps = {
	mainButton: null,
	secondaryButton: null,
};

export default Dialog;
