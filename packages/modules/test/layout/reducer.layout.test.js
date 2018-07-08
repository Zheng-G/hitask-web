import reducer, {
	toggleCentralHeader,
	toggleCreateForm,
	toggleItemHierarchy,
	toggleProjectHierarchy,
	toggleProjectGroups,
	syncProjectGroups,
} from '../../src/layout';
import appState from './state.mock';

// More examples at https://redux.js.org/recipes/writing-tests
const { layout: initState } = appState;
describe('Modules.layout module, reducer', () => {
	describe('toggleCentralHeader action', () => {
		it('should toggle central header visibility flag', () => {
			const nextStateOpened = reducer(initState, toggleCentralHeader({ isOpen: true }));
			expect(nextStateOpened.centralHeaderVisible).toBe(true);
			const nextStateClosed = reducer(initState, toggleCentralHeader({ isOpen: false }));
			expect(nextStateClosed.centralHeaderVisible).toBe(false);
		});
	});

	describe('toggleCreateForm action', () => {
		it('should toggle NewItemForm visibility flag', () => {
			const nextStateOpened = reducer(initState, toggleCreateForm({ isOpen: true }));
			expect(nextStateOpened.createFormOpened).toBe(true);
			const nextStateClosed = reducer(initState, toggleCreateForm({ isOpen: false }));
			expect(nextStateClosed.createFormOpened).toBe(false);
		});
	});

	describe('toggleItemHierarchy action', () => {
		it('should toggle item "isHierarchyOpened" flag', () => {
			const testItemId = 11111;
			const getIsHierarchyOpened = (state, itemId) =>
				state.items[itemId] && state.items[itemId].isHierarchyOpened;
			const nextState = reducer(initState, toggleItemHierarchy({ itemId: testItemId }));
			expect(getIsHierarchyOpened(nextState, testItemId)).toBe(
				!getIsHierarchyOpened(initState, testItemId)
			);
		});
	});

	describe('toggleProjectHierarchy action', () => {
		it('should toggle project "isHierarchyOpened" flag', () => {
			const testItemId = 22220;
			const getIsHierarchyOpened = (state, itemId) =>
				state.projects[itemId] && state.projects[itemId].isHierarchyOpened;
			const nextState = reducer(initState, toggleProjectHierarchy({ itemId: testItemId }));
			expect(getIsHierarchyOpened(nextState, testItemId)).toBe(
				!getIsHierarchyOpened(initState, testItemId)
			);
		});
	});

	describe('toggleProjectGroups action', () => {
		it('should toggle all project items "isHierarchyOpened" flag', () => {
			const testItemId = 22220;
			const getIsHierarchyOpened = (state, itemId) =>
				state.projects[itemId] && state.projects[itemId].isHierarchyOpened;
			const expectedValue = !getIsHierarchyOpened(initState, testItemId);
			const nextState = reducer(initState, toggleProjectGroups({ itemId: testItemId }));
			Object.keys(initState.projects).forEach(id => {
				expect(getIsHierarchyOpened(nextState, id)).toBe(expectedValue);
			});
		});
	});

	describe('syncProjectGroups action', () => {
		it('should update list of project groups', () => {
			const expectedShape = {
				112233: {
					id: 112233,
					isHierarchyOpened: false,
				},
				445566: {
					id: 445566,
					isHierarchyOpened: false,
				},
			};
			const projects = [112233, 445566];
			const nextState = reducer(initState, syncProjectGroups({ projects }));
			expect(nextState.projects).toEqual(expectedShape);
		});

		it('should preserve state of existing project groups', () => {
			const expectedShape = {
				11110: {
					id: 11110,
					isHierarchyOpened: true,
				},
				22220: {
					id: 22220,
					isHierarchyOpened: false,
				},
				33330: {
					id: 33330,
					isHierarchyOpened: true,
				},
				445566: {
					id: 445566,
					isHierarchyOpened: false,
				},
			};
			const projects = [11110, 22220, 33330, 445566];
			const nextState = reducer(initState, syncProjectGroups({ projects }));
			expect(nextState.projects).toEqual(expectedShape);
		});
	});
});
