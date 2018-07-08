import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logRender } from '@hitask/utils/debug';
import ItemAttachment from '../../containers/ItemAttachmentContainer';
import classes from './ItemAttachments.scss';

class ItemAttachments extends Component {
	shouldComponentUpdate({ attachments }) {
		return attachments.join(',') !== this.props.attachments.join(',');
	}

	render() {
		const { attachments } = this.props;
		logRender('render ItemAttachments');
		return attachments.length ? (
			<div className={classes.propRow}>
				{attachments.map(attachId => <ItemAttachment id={attachId} key={attachId} />)}
			</div>
		) : null;
	}
}

const { arrayOf, number } = PropTypes;
ItemAttachments.propTypes = {
	attachments: arrayOf(number).isRequired,
};

export default ItemAttachments;
