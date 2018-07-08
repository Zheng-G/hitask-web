import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Intent } from '@hitask/blueprint-core';
import { Routes } from '@hitask/constants/layout';
import { logRender } from '@hitask/utils/debug';
import Link from '../LinkAdaptive';
import Dialog from '../Dialog';
import Callout from '../Callout';

const ImportSucceedDialog = ({ isOpen, closeDialog }) => {
	logRender('render ImportSucceedDialog');
	return (
		<Dialog
			isOpen={isOpen}
			closeDialog={closeDialog}
			mainButton={
				__INDEPENDENT_IMPORT__ ? (
					<Link href={`${__PLAY_APP_BASE_URL__}/app`}>
						<Button
							text="Back to app"
							onClick={() => {
								closeDialog();
							}}
							intent={Intent.PRIMARY}
						/>
					</Link>
				) : (
					<RouterLink to={Routes.APP}>
						<Button
							text="Back to app"
							onClick={() => {
								closeDialog();
							}}
							intent={Intent.PRIMARY}
						/>
					</RouterLink>
				)
			}
			secondaryButton={<Button text="Import More" onClick={closeDialog} />}
		>
			<Callout intent={Intent.PRIMARY}>Items imported!</Callout>
		</Dialog>
	);
};

const { bool, func } = PropTypes;
ImportSucceedDialog.propTypes = {
	isOpen: bool.isRequired,
	closeDialog: func.isRequired,
};

export default ImportSucceedDialog;
