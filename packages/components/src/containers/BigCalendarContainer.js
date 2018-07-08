import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
	queryItemsSelectorFactory,
	formatBigCalendarEventItems,
	editItem,
} from '@hitask/modules/items';
import { Overlays, openOverlay } from '@hitask/modules/overlays';
import { ItemCategories, DateQuery } from '@hitask/constants/item';
import BigCalendar from '../presentational/BigCalendar';

const mapActionCreators = dispatch => ({
	openItemView: ({ id }) => dispatch(openOverlay({ name: Overlays.ITEM_VIEW, props: { id } })),
	editItem: ({ id, start, end }) =>
		dispatch(
			editItem({
				itemId: id,
				changedData: {
					startDate: start.toISOString(),
					endDate: end.toISOString(),
				},
			})
		),
});

const eventsSelector = createSelector(
	[
		queryItemsSelectorFactory({
			category: [ItemCategories.TASK, ItemCategories.EVENT],
			date: DateQuery.WITH_DATE,
		}),
	],
	formatBigCalendarEventItems
);

const mapStateToProps = state => ({
	events: eventsSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(BigCalendar);
