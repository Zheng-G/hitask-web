import reducer, { loading, uploading, historyLoading, historyUploading } from '../../src/items';
import globalState from './state.mock';

// More examples at https://redux.js.org/recipes/writing-tests
const { items: initState } = globalState;
describe('Modules.items module, reducer', () => {
	describe('loading action', () => {
		it('should set "loading" flag to true', () => {
			const nextState = reducer(initState, loading());
			expect(nextState.loading).toBe(true);
		});
	});

	describe('uploading action', () => {
		it('should set "uploading" flag to true', () => {
			const nextState = reducer(initState, uploading());
			expect(nextState.uploading).toBe(true);
		});
	});

	describe('historyLoading action', () => {
		it('should set "historyLoading" flag to true', () => {
			const nextState = reducer(initState, historyLoading());
			expect(nextState.historyLoading).toBe(true);
		});
	});

	describe('historyUploading action', () => {
		it('should set "historyUploading" flag to true', () => {
			const nextState = reducer(initState, historyUploading());
			expect(nextState.historyUploading).toBe(true);
		});
	});
});
