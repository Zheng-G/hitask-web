/* eslint react/no-danger: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatText } from '@hitask/utils/textile';
import { logRender } from '@hitask/utils/debug';
import classes from './MarkdownText.scss';

class MarkdownText extends React.PureComponent {
	render() {
		const { text, itemId, className } = this.props;
		logRender(`render MarkdownText #${itemId}`);
		return (
			<div
				className={classNames(classes.wrapper, className)}
				dangerouslySetInnerHTML={{ __html: formatText(text) }}
			/>
		);
	}
}

const { string, number } = PropTypes;
MarkdownText.propTypes = {
	text: string.isRequired,
	className: string,
	itemId: number.isRequired,
};

MarkdownText.defaultProps = {
	className: '',
};

export default MarkdownText;
