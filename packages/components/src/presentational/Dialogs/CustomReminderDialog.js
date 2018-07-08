import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { logRender } from '@hitask/utils/debug';
import Dialog from '../Dialog';
import CustomReminderForm from '../CustomReminderForm';
import classes from './CustomReminderDialog.scss';

// TODO: localize title
class CustomReminderDialog extends PureComponent {
	render() {
		const { isOpen, closeDialog, ...formProps } = this.props;
		logRender('render CustomReminderDialog');
		return (
			<Dialog
				isOpen={isOpen}
				closeDialog={closeDialog}
				iconName="time"
				title="Specify date and time"
				className={classes.dialog}
			>
				<CustomReminderForm {...formProps} onCancel={closeDialog} />
			</Dialog>
		);
	}
}

const { bool, func } = PropTypes;
CustomReminderDialog.propTypes = {
	isOpen: bool.isRequired,
	closeDialog: func.isRequired,
};

export default CustomReminderDialog;
