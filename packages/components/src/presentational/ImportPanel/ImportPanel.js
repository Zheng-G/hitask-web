import React from 'react';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';
import { Button, Intent } from '@hitask/blueprint-core';
import SimpleContentLayout from '../SimpleContentLayout';
import classes from './ImportPanel.scss';

const ImportPanel = ({ isLoading, connectDropTarget, acceptFile }) =>
	connectDropTarget(
		<div className="full-height">
			<SimpleContentLayout
				contentProps={{
					isLoading,
					contentClassName: classes.panel,
				}}
			>
				<h1 className={classes.columnElement}>
					<Translate value={__T('hi.import.import_tasks')} />
				</h1>
				<h4 className={classes.columnElement}>
					<Translate value={__T('hi.import.upload_excel_or_csv')} />
				</h4>
				<Button
					text={I18n.t(__T('hi.import.select_file'))}
					className={classes.columnElement}
					disabled={isLoading}
					intent={Intent.PRIMARY}
				>
					<input
						type="file"
						className={classes.input}
						onChange={e => {
							acceptFile(e.target.files[0]);
						}}
					/>
				</Button>
				<Translate value={__T('hi.import.or_dnd')} className={classes.columnElement} />
			</SimpleContentLayout>
		</div>
	);

const { func, bool } = PropTypes;
ImportPanel.propTypes = {
	connectDropTarget: func.isRequired,
	acceptFile: func.isRequired,
	isLoading: bool.isRequired,
};

export default ImportPanel;
