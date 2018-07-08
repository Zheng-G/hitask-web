import { isExtension } from './helpers';

const saveState = state => chrome.storage.local.set({ state: JSON.stringify(state) });

export default function() {
	return next => (reducer, initialState) => {
		const store = next(reducer, initialState);
		if (isExtension) {
			store.subscribe(() => {
				const state = store.getState();
				saveState(state);
			});
		}
		return store;
	};
}
