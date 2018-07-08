import moment from 'moment-timezone';
import { recurringItemMatchesDate } from '../../src/items/items.logic';
import {
	todayMainQuerySelector,
	todayCompletedQuerySelector,
	overdueQuerySelector,
	allMainQuerySelector,
	allCompletedQuerySelector,
	getItemSortedHierarchy,
} from '../../src/items';
import state, { withCompletedItems } from './state.mock';

moment.tz.setDefault('Europe/Kiev');
const getItems = appState => appState.items.items;
const getItemById = (appState, itemId) => appState.items.items[itemId];

const testRecurDateMatch = (item, unit) => {
	it('should match startDate instance', () => {
		const recurInstance = recurringItemMatchesDate(item, moment(item.startDate));
		expect(recurInstance).toBeTruthy();
		expect(recurInstance.isSame(item.startDate, 'day')).toBe(true);
	});

	it('should match recurEndDate instance', () => {
		const recurInstance = recurringItemMatchesDate(item, moment(item.recurEndDate));
		expect(recurInstance).toBeTruthy();
		expect(recurInstance.isSame(item.recurEndDate, 'day')).toBe(true);
	});

	it('should match intermediate instances', () => {
		let pointerDate = moment(item.startDate).add(item.recurInterval, unit);
		while (pointerDate.isBefore(item.recurEndDate)) {
			const recurInstance = recurringItemMatchesDate(item, pointerDate);
			expect(recurInstance).toBeTruthy();
			expect(recurInstance.isSame(pointerDate, 'day')).toBe(true);
			pointerDate = pointerDate.add(item.recurInterval, unit);
		}
	});
};

const testRecurItemEachDayMatch = (item, unit) => {
	it('should match the date during item progress', () => {
		const itemDuration = moment(item.endDate).diff(item.startDate, 'days');
		let i = 1;
		const pointerInstance = moment(item.startDate).add(item.recurInterval, unit);
		while (i < itemDuration) {
			const pointerDate = pointerInstance.add(i, 'day');
			const recurInstance = recurringItemMatchesDate(item, pointerDate);
			expect(recurInstance).toBeTruthy();
			expect(pointerInstance.isSame(pointerDate, 'day')).toBe(true);
			i += 1;
		}
	});
};

describe('Modules.items module, selectors', () => {
	describe('recurringItemMatchesDate', () => {
		describe('daily recurring item', () => {
			const item = state.items.items[3734453];
			testRecurDateMatch(item, 'day');
		});

		describe('weekly recurring item', () => {
			const item = state.items.items[3734443];
			testRecurDateMatch(item, 'week');
		});

		describe('weekly recurring item with duration', () => {
			const item = state.items.items[3734456];
			testRecurDateMatch(item, 'week');
			testRecurItemEachDayMatch(item, 'week');
		});

		describe('monthly recurring item', () => {
			const item = state.items.items[3734454];
			testRecurDateMatch(item, 'month');
		});

		describe('yearly recurring item', () => {
			const item = state.items.items[3734455];
			testRecurDateMatch(item, 'year');
		});
	});

	const TodayTestItems = {
		task: {
			START_TODAY: 3734592,
			END_TODAY: 3734594,
			TODAY_IN_THE_MIDDLE: 3734597,
			COMPLETED: 3734595,
			SUBITEM: 3734591, // Parent - #3734530
			COMPLETED_SUBITEM: 3734510, // Parent - #3734592
		},
		event: {
			START_TODAY: 3734593,
			END_TODAY: 3734596,
			TODAY_IN_THE_MIDDLE: 3734598,
		},
		note: {
			STARRED: 3734599,
		},
	};

	/*
	 * QuerySelectors return only top-level items!
	 */
	describe('todayMainQuerySelector', () => {
		const filteredItemsHash = todayMainQuerySelector(state);

		it('should pass task item with today startDate', () => {
			expect(filteredItemsHash[TodayTestItems.task.START_TODAY]).toBeDefined();
		});

		it('should pass task item with today endDate', () => {
			expect(filteredItemsHash[TodayTestItems.task.END_TODAY]).toBeDefined();
		});

		it('should pass task item with startDate before today and endDate after today', () => {
			expect(filteredItemsHash[TodayTestItems.task.TODAY_IN_THE_MIDDLE]).toBeDefined();
		});

		it('should pass event item with today startDate', () => {
			expect(filteredItemsHash[TodayTestItems.event.START_TODAY]).toBeDefined();
		});

		it('should pass event item with today endDate', () => {
			expect(filteredItemsHash[TodayTestItems.event.END_TODAY]).toBeDefined();
		});

		it('should pass event item with startDate before today and endDate after today', () => {
			expect(filteredItemsHash[TodayTestItems.event.TODAY_IN_THE_MIDDLE]).toBeDefined();
		});

		it('should pass note starred item', () => {
			expect(filteredItemsHash[TodayTestItems.note.STARRED]).toBeDefined();
		});

		it('should pass subitem with today startDate, if parent is not passed', () => {
			expect(filteredItemsHash[TodayTestItems.task.SUBITEM]).toBeDefined();
		});

		it('should not pass completed item with today startDate', () => {
			expect(filteredItemsHash[TodayTestItems.task.COMPLETED]).toBeUndefined();
		});
	});

	describe('todayCompletedQuerySelector', () => {
		const CompletableTodayItemsIds = []
			.concat(Object.keys(TodayTestItems.task).map(key => TodayTestItems.task[key]))
			.concat(Object.keys(TodayTestItems.event).map(key => TodayTestItems.event[key]));
		const filteredItemsHash = todayCompletedQuerySelector(
			withCompletedItems(state, CompletableTodayItemsIds)
		);

		it('should pass completed task item with today startDate', () => {
			expect(filteredItemsHash[TodayTestItems.task.START_TODAY]).toBeDefined();
		});

		it('should pass completed task item with today endDate', () => {
			expect(filteredItemsHash[TodayTestItems.task.END_TODAY]).toBeDefined();
		});

		it('should pass completed task item with startDate before today and endDate after today', () => {
			expect(filteredItemsHash[TodayTestItems.task.TODAY_IN_THE_MIDDLE]).toBeDefined();
		});

		it('should pass completed event item with today startDate', () => {
			expect(filteredItemsHash[TodayTestItems.event.START_TODAY]).toBeDefined();
		});

		it('should pass completed event item with today endDate', () => {
			expect(filteredItemsHash[TodayTestItems.event.END_TODAY]).toBeDefined();
		});

		it('should pass completed event item with startDate before today and endDate after today', () => {
			expect(filteredItemsHash[TodayTestItems.event.TODAY_IN_THE_MIDDLE]).toBeDefined();
		});

		it('should not pass completed subitem with today startDate, if parent is not passed', () => {
			expect(filteredItemsHash[TodayTestItems.task.SUBITEM]).toBeUndefined();
		});
	});

	const OverdueTestItems = {
		task: {
			START_YESTERDAY: 3734512,
			END_YESTERDAY: 3734512,
			COMPLETED_END_YESTERDAY: 3734513,
		},
		event: {
			START_YESTERDAY: 3734518,
		},
	};

	describe('overdueQuerySelector', () => {
		const filteredItemsHash = overdueQuerySelector(state);

		it('should pass only uncompleted items', () => {
			Object.keys(filteredItemsHash).forEach(key => {
				expect(filteredItemsHash[key].completed).toBeFalsy();
			});
		});

		it('should pass only task items', () => {
			Object.keys(filteredItemsHash).forEach(key => {
				expect(filteredItemsHash[key].category).toBe(1);
			});
		});

		it('should pass uncompleted task item with yesterday startDay', () => {
			expect(filteredItemsHash[OverdueTestItems.task.START_YESTERDAY]).toBeDefined();
		});

		it('should pass uncompleted task item with yesterday endDate', () => {
			expect(filteredItemsHash[OverdueTestItems.task.END_YESTERDAY]).toBeDefined();
		});
	});

	describe('allMainQuerySelector', () => {
		const filteredItemsHash = allMainQuerySelector(state);

		it('should pass only uncompleted items', () => {
			Object.keys(filteredItemsHash).forEach(key => {
				expect(filteredItemsHash[key].completed).toBeFalsy();
			});
		});

		it('should not pass project items', () => {
			Object.keys(filteredItemsHash).forEach(key => {
				expect(filteredItemsHash[key].category).not.toBe(0);
			});
		});

		// While calendar tab is not ready, allow event items in all-items lists
		const CALENDAR_IS_READY = false;
		it.skip('should not pass event items', () => {
			Object.keys(filteredItemsHash).forEach(key => {
				expect(filteredItemsHash[key].category).not.toBe(2);
			});
		});

		it(`should pass all uncompleted top-level items, except ${
			CALENDAR_IS_READY ? 'Events, ' : ' '
		}Projects`, () => {
			const itemsHash = state.items.items;
			const expectedLength = Object.keys(itemsHash)
				.filter(id => !itemsHash[id].completed)
				.filter(id => {
					if (!itemsHash[id].parent) return true;
					const parent = itemsHash[id].parent;
					return parent.category === 0; // Allow only project parents
				})
				.filter(id => (CALENDAR_IS_READY ? itemsHash[id].category !== 2 : true))
				.filter(id => itemsHash[id].category !== 0).length;

			expect(Object.keys(filteredItemsHash).length).toBe(expectedLength);
		});
	});

	describe('allCompletedQuerySelector', () => {
		const filteredItemsHash = allCompletedQuerySelector(state);

		it('should pass only completed items', () => {
			Object.keys(filteredItemsHash).forEach(key => {
				expect(filteredItemsHash[key].completed).toBeTruthy();
			});
		});

		it('should not pass project items', () => {
			Object.keys(filteredItemsHash).forEach(key => {
				expect(filteredItemsHash[key].category).not.toBe(0);
			});
		});

		// While calendar tab is not ready, allow event items in all-items lists
		const CALENDAR_IS_READY = false;
		it.skip('should not pass event items', () => {
			Object.keys(filteredItemsHash).forEach(key => {
				expect(filteredItemsHash[key].category).not.toBe(2);
			});
		});

		it(`should pass all completed top-level items, except ${
			CALENDAR_IS_READY ? 'Events, ' : ' '
		}Projects`, () => {
			const itemsHash = state.items.items;
			const expectedLength = Object.keys(itemsHash)
				.filter(id => itemsHash[id].completed)
				.filter(id => {
					if (!itemsHash[id].parent) return true;
					const parent = itemsHash[id].parent;
					return parent.category === 0; // Allow only project parents
				})
				.filter(id => (CALENDAR_IS_READY ? itemsHash[id].category !== 2 : true))
				.filter(id => itemsHash[id].category !== 0).length;

			expect(Object.keys(filteredItemsHash).length).toBe(expectedLength);
		});
	});

	describe('getItemSortedHierarchy', () => {
		const SORTING = 'PRIORITY';
		const ZERO_LEVEL_TEST_ID = 3234596;
		const ONE_LEVEL_TEST_ID = 3234591;
		const TWO_LEVELS_TEST_ID = 3234593;
		const zeroLevelHierarchy = getItemSortedHierarchy(
			getItems(state),
			ZERO_LEVEL_TEST_ID,
			SORTING
		);
		const oneLevelHierarchy = getItemSortedHierarchy(
			getItems(state),
			ONE_LEVEL_TEST_ID,
			SORTING
		);
		const twoLevelsHierarchy = getItemSortedHierarchy(
			getItems(state),
			TWO_LEVELS_TEST_ID,
			SORTING
		);

		it('should not return children for zero-level hierarchy item', () => {
			expect(zeroLevelHierarchy.id).toBe(ZERO_LEVEL_TEST_ID);
			expect(zeroLevelHierarchy.children.length).toBe(0);
		});

		it('should collect all children of one-level hierarchy item', () => {
			expect(oneLevelHierarchy.id).toBe(ONE_LEVEL_TEST_ID);
			expect(oneLevelHierarchy.children.length).toBe(1);
			const child = oneLevelHierarchy.children[0];
			expect(child.id).toBe(ZERO_LEVEL_TEST_ID);
			expect(child.children.length).toBe(0);
		});

		it('should collect all children of two-levels hierarchy item', () => {
			expect(twoLevelsHierarchy.id).toBe(TWO_LEVELS_TEST_ID);
			expect(twoLevelsHierarchy.children.length).toBe(2);
			const firstChild = twoLevelsHierarchy.children[0];
			const secondChild = twoLevelsHierarchy.children[1];
			expect(firstChild.id).toBe(3234592);
			expect(firstChild.children.length).toBe(0);
			expect(secondChild.id).toBe(ONE_LEVEL_TEST_ID);
			expect(secondChild.children.length).toBe(1);
			const grandChild = secondChild.children[0];
			expect(grandChild.id).toBe(ZERO_LEVEL_TEST_ID);
			expect(grandChild.children.length).toBe(0);
		});

		it('should return children in order according sorting parameter', () => {
			const firstChild = twoLevelsHierarchy.children[0];
			const secondChild = twoLevelsHierarchy.children[1];
			expect(getItemById(state, firstChild.id).priority).toBeGreaterThan(
				getItemById(state, secondChild.id).priority
			);
		});
	});
});
