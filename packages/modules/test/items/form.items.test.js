import { formItemDiffSelector } from '../../src/items';
import state from './state.mock';

describe('Modules.items module, form', () => {
	describe('formItemDiffSelector', () => {
		const testEmptyItemId = 3740382;
		const formItemBase = {
			title: 'Empty item, high priority, private',
			message: '',
			starred: false,
			completed: false,
			category: 1,
			startDate: null,
			startTime: null,
			endDate: null,
			endTime: null,
			isAllDay: false,
			recurType: 0,
			recurInterval: 1,
			recurEndDate: '2019-03-06T07:03:13.346+02:00',
			recurNeverEnd: false,
			alerts: [],
			permissions: [
				{
					level: 100,
					principal: '190234',
				},
			],
			assignee: 0,
			participants: '',
			parent: 0,
			priority: 'HIGH',
			tags: '',
			color: 0,
			userId: 190234,
		};

		it('should return false if no changes were applied', () => {
			const itemDiff = formItemDiffSelector(state, formItemBase, testEmptyItemId);
			expect(itemDiff).toBe(false);
		});

		it('should detect simple title change', () => {
			const formItem = {
				...formItemBase,
				title: 'Changed item',
			};
			const itemDiff = formItemDiffSelector(state, formItem, testEmptyItemId);
			expect(Object.keys(itemDiff)).toHaveLength(1);
			expect(itemDiff).toMatchObject({
				title: 'Changed item',
			});
		});
	});
});
