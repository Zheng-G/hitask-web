import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip as BpTooltip } from '@hitask/blueprint-core';

const Tooltip = ({ children, ...otherProps }) => <BpTooltip {...otherProps}>{children}</BpTooltip>;

const { any } = PropTypes;
Tooltip.propTypes = {
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Tooltip;
