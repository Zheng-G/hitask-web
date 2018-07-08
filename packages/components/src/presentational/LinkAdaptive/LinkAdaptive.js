import React from 'react';
import PropTypes from 'prop-types';
import { isExtension, isElectron, openUrl } from '@hitask/utils/helpers';

const LinkAdaptive = ({ href, onClick, children, ...otherProps }) => {
	if (isExtension) {
		return (
			<a
				href={href}
				onClick={e => {
					e.preventDefault();
					openUrl(href);
					onClick(e);
				}}
				{...otherProps}
			>
				{children}
			</a>
		);
	}
	if (isElectron) {
		return (
			<a href={href} onClick={onClick} target="_blank" {...otherProps}>
				{children}
			</a>
		);
	}
	return (
		<a href={href} onClick={onClick} {...otherProps}>
			{children}
		</a>
	);
};

const { any, string, func } = PropTypes;
LinkAdaptive.propTypes = {
	href: string,
	onClick: func,
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
};

const emptyFunc = () => {};
LinkAdaptive.defaultProps = {
	href: null,
	onClick: emptyFunc,
};

export default LinkAdaptive;
