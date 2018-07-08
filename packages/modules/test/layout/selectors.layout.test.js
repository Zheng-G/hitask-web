import {
	centralHeaderVisibleSelector,
	createFormOpenedSelector,
	isItemHierarchyOpenedSelector,
	isProjectHierarchyOpenedSelector,
} from '../../src/layout';
import state from './state.mock';

describe('Modules.layout module, selectors', () => {
	describe('centralHeaderVisibleSelector', () => {
		it('should return centralHeaderVisible value', () => {
			expect(centralHeaderVisibleSelector(state)).toBe(true);
		});
	});

	describe('createFormOpenedSelector', () => {
		it('should return createFormOpened value', () => {
			expect(createFormOpenedSelector(state)).toBe(false);
		});
	});

	describe('isItemHierarchyOpenedSelector', () => {
		it('should return isHierarchyOpened value for registered item', () => {
			const testItemId = 11111;
			expect(isItemHierarchyOpenedSelector(state, testItemId)).toBe(true);
		});

		it('should return false value for unregistered item', () => {
			const testItemId = 1010101010;
			expect(isItemHierarchyOpenedSelector(state, testItemId)).toBe(false);
		});
	});

	describe('isProjectHierarchyOpenedSelector', () => {
		it('should return isHierarchyOpened value for registered project', () => {
			const testItemId = 22220;
			expect(isProjectHierarchyOpenedSelector(state, testItemId)).toBe(false);
		});

		it('should return false value for unregistered project', () => {
			const testItemId = 202020202;
			expect(isProjectHierarchyOpenedSelector(state, testItemId)).toBe(false);
		});
	});
});
