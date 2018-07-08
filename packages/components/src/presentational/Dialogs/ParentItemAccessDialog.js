import React from 'react';
import PropTypes from 'prop-types';
import { Button, Intent } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import Dialog from '../Dialog';
import Callout from '../Callout';

const ParentItemAccessDialog = ({
	isOpen,
	closeDialog,
	userName,
	parentTitle,
	allowItemAccess,
	cancelChange,
	userId,
	parentId,
	level,
}) => {
	logRender('render ParentItemAccessDialog');
	return (
		<Dialog
			isOpen={isOpen}
			closeDialog={closeDialog}
			canEscapeKeyClose={false}
			canOutsideClickClose={false}
			mainButton={
				<Button
					text="Allow access"
					onClick={() => {
						allowItemAccess({ userId, itemId: parentId, level });
						closeDialog();
					}}
					intent={Intent.PRIMARY}
				/>
			}
			secondaryButton={
				<Button
					text="Cancel"
					onClick={() => {
						cancelChange();
						closeDialog();
					}}
				/>
			}
		>
			<Callout intent={Intent.DANGER} iconName="warning-sign">
				{`${userName} does not have access to this item's parent "${parentTitle}".`}
				<br />
				Allow to access it?
			</Callout>
		</Dialog>
	);
};

const { bool, func, string, number } = PropTypes;
ParentItemAccessDialog.propTypes = {
	isOpen: bool.isRequired,
	closeDialog: func.isRequired,
	allowItemAccess: func.isRequired,
	cancelChange: func,
	userName: string,
	parentTitle: string,
	userId: number,
	parentId: number,
	level: number,
};

const emptyFunc = () => {};
ParentItemAccessDialog.defaultProps = {
	cancelChange: emptyFunc,
	userName: '',
	parentTitle: '',
	userId: null,
	parentId: null,
	level: null,
};

export default ParentItemAccessDialog;
