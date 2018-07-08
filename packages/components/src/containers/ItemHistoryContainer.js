import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selfProfileSelector } from '@hitask/modules/auth';
import {
	deleteComment,
	itemsSelector,
	historySelector,
	getItemHistory,
} from '@hitask/modules/items';
import { teammatesProfilesSelector } from '@hitask/modules/user';
import ItemHistory from '../presentational/ItemHistory';

const mapActionCreators = (dispatch, { itemId }) => ({
	deleteComment(commentId) {
		return dispatch(deleteComment({ commentId, itemId }));
	},
});

const historySelectorFactory = itemId => {
	return createSelector(
		[itemsSelector, historySelector, selfProfileSelector, teammatesProfilesSelector],
		(itemsHash, historyHash, selfProfile, teammatesProfiles) =>
			getItemHistory(itemsHash, historyHash, itemId, selfProfile, teammatesProfiles)
	);
};

const mapStateToProps = (initState, { itemId }) => {
	const itemHistorySelector = historySelectorFactory(itemId);
	return state => ({
		units: itemHistorySelector(state),
	});
};

export default connect(mapStateToProps, mapActionCreators)(ItemHistory);
