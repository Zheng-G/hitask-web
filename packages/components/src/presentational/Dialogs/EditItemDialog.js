import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { logRender } from '@hitask/utils/debug';
import Dialog from '../Dialog';
import EditItemForm from '../../containers/EditItemFormContainer';
import classes from './EditItemDialog.scss';

// TODO: localize title
class EditItemDialog extends PureComponent {
	render() {
		const { isOpen, closeDialog, ...formProps } = this.props;
		logRender('render EditItemDialog');
		return (
			<Dialog
				isOpen={isOpen}
				closeDialog={closeDialog}
				title="Edit item"
				className={classes.dialog}
				canOutsideClickClose={false}
			>
				<EditItemForm {...formProps} closeForm={closeDialog} fixedHeight />
			</Dialog>
		);
	}
}

const { bool, func } = PropTypes;
EditItemDialog.propTypes = {
	isOpen: bool.isRequired,
	closeDialog: func.isRequired,
};

export default EditItemDialog;
