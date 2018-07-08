import { connect } from 'react-redux';
import { itemSelector, itemAttachmentPreviewUrlSelector, requestFile } from '@hitask/modules/items';
import { ItemAttachmentPreviewSizes } from '@hitask/constants/item';
import ItemAttachment from '../presentational/ItemAttachment';

const mapActionCreators = (dispatch, { id }) => ({
	onTitleClick() {
		dispatch(requestFile({ fileItemId: id }));
	},
});

const mapStateToProps = (state, { id }) => {
	const item = itemSelector(state, id);
	return {
		title: item.title,
		previewUrl: itemAttachmentPreviewUrlSelector(
			state,
			id,
			30,
			ItemAttachmentPreviewSizes.SQUARE
		),
	};
};

export default connect(mapStateToProps, mapActionCreators)(ItemAttachment);
