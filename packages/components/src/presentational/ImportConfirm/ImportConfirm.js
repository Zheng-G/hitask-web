import React from 'react';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';
import _some from 'lodash/some';
import moment from 'moment-timezone';
import { Button, Intent } from '@hitask/blueprint-core';
import { Table, Column, Cell, TruncatedFormat } from '@hitask/blueprint-table';
import { getPriorityByNumber } from '@hitask/utils/helpers';
import { Priorities } from '@hitask/constants/item';
import Spinner from '../Spinner';
import classes from './ImportConfirm.scss';

// TODO: localize
const tableColumns = [
	{
		label: 'Title',
		key: 'title',
	},
	{
		label: 'Start',
		key: 'start_date',
		isDate: true,
	},
	{
		label: 'End',
		key: 'end_date',
		isDate: true,
	},
	{
		label: 'Priority',
		key: 'priority',
	},
	{
		label: 'Time Estimation',
		key: 'time_est',
	},
	{
		label: 'Time Spent',
		key: 'time_spent',
	},
	{
		label: 'Tags',
		key: 'tags',
	},
	{
		label: 'Description',
		key: 'message',
	},
];

const formatItems = items => Object.keys(items).map(key => items[key]);

const getActualColumts = (items, columns) =>
	columns.filter(col => _some(items, entity => entity[col.key]));

const formatContent = (content, column) => {
	if (column.key === 'priority') {
		const priority = getPriorityByNumber(content);
		return I18n.t(Priorities[priority].label);
	}
	if (column.isDate) {
		return moment(content).format('lll');
	}
	return Array.isArray(content) ? content.join(', ') : content;
};

const renderCellFactory = (items, columns) => (rowIndex, colIndex) => {
	const content = items[rowIndex][columns[colIndex].key];
	if (!content) return <Cell />;
	const formattedContent = formatContent(content, columns[colIndex]);
	return (
		<Cell>
			<TruncatedFormat detectTruncation>{formattedContent}</TruncatedFormat>
		</Cell>
	);
};

const ImportConfirm = ({ items, cancel, createTasks, isLoading }) => {
	const itemsData = formatItems(items);
	const actualColumns = getActualColumts(items, tableColumns);
	return (
		<main className={classes.container}>
			<h1 className={classes.title}>
				<Translate value={__T('hi.import.review_and_confirm')} />
			</h1>
			<div className={classes.tableContainer}>
				<Table numRows={itemsData.length} fillBodyWithGhostCells>
					{actualColumns.map(col => (
						<Column
							name={col.label}
							key={col.key}
							renderCell={renderCellFactory(itemsData, actualColumns)}
						/>
					))}
				</Table>
				{isLoading && (
					<div className={classes.loader}>
						<Spinner />
					</div>
				)}
			</div>
			<footer className={classes.footer}>
				<Button text="Cancel and Start Over" onClick={cancel} />
				{`Importing ${itemsData.length} items`}
				<Button
					text="Create Tasks"
					onClick={createTasks}
					intent={Intent.PRIMARY}
					disabled={isLoading}
				/>
			</footer>
		</main>
	);
};

const { object, oneOfType, func, bool } = PropTypes;
ImportConfirm.propTypes = {
	items: oneOfType([object]).isRequired,
	isLoading: bool.isRequired,
	cancel: func.isRequired,
	createTasks: func.isRequired,
};

export default ImportConfirm;
