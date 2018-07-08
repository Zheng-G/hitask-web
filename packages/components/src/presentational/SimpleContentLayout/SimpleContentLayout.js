import React from 'react';
import PropTypes from 'prop-types';
import Header from '../HeaderSimplified';
import ContentPanel from '../ContentPanel';
import classes from './SimpleContentLayout.scss';

const SimpleContentLayout = ({ children, contentProps }) => (
	<div className={classes.wrapper}>
		<Header />
		<ContentPanel {...contentProps}>{children}</ContentPanel>
	</div>
);

const { any, shape } = PropTypes;
SimpleContentLayout.propTypes = {
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
	contentProps: shape({}),
};

SimpleContentLayout.defaultProps = {
	contentProps: {},
};

export default SimpleContentLayout;
