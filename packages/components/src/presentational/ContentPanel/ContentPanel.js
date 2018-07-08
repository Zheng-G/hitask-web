import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Spinner from '../Spinner';
import classes from './ContentPanel.scss';

const ContentPanel = ({ children, isLoading, className, contentClassName }) => (
	<main
		className={classNames(classes.panel, className, {
			[classes.loading]: isLoading,
		})}
	>
		<div className={classNames(classes.contentWrapper, contentClassName)}>{children}</div>
		{isLoading && (
			<div className={classes.loader}>
				<Spinner />
			</div>
		)}
	</main>
);

const { any, string, bool } = PropTypes;
ContentPanel.propTypes = {
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
	isLoading: bool,
	className: string,
	contentClassName: string,
};

ContentPanel.defaultProps = {
	isLoading: false,
	className: '',
	contentClassName: '',
};

export default ContentPanel;
