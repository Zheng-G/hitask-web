import { connect } from 'react-redux';
import { itemAttachedFilesSelector } from '@hitask/modules/items';
import ItemAttachments from '../presentational/ItemAttachments';

const mapActionCreators = {};

const mapStateToProps = (state, { itemId }) => ({
	attachments: itemAttachedFilesSelector(state, itemId),
});

export default connect(mapStateToProps, mapActionCreators)(ItemAttachments);
