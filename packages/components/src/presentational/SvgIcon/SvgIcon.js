/* eslint react/no-danger:0 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SvgIcon = ({ name, width, height, title, className, useClassName, onClick }) => (
	<svg
		className={classNames(className)}
		width={width}
		height={height}
		title={title}
		onClick={onClick}
		dangerouslySetInnerHTML={{
			__html: `<use class="${useClassName}" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/icons/icons.svg#${name}"></use>`,
		}}
	/>
);

const { string, number, func } = PropTypes;
SvgIcon.propTypes = {
	name: string.isRequired,
	width: number,
	height: number,
	title: string,
	className: string,
	useClassName: string,
	onClick: func,
};

const emptyFunc = () => {};
SvgIcon.defaultProps = {
	width: 20,
	height: 20,
	title: '',
	className: '',
	useClassName: '',
	onClick: emptyFunc,
};

export default SvgIcon;
