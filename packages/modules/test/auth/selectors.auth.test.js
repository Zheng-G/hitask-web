import {
	sessionSelector,
	hasSessionSelector,
	selfProfileSelector,
	selfIdSelector,
	selfNameSelector,
	selfPictureHashSelector,
	selfEmailSelector,
	accountTypeSelector,
	loadingSelector,
	errorSelector,
} from '../../src/auth';
import { signedInState, signedOutState } from './state.mock';

const session = signedInState.auth.session;
describe('Modules.auth module, selectors', () => {
	describe('sessionSelector', () => {
		it('should return original session object', () => {
			expect(sessionSelector(signedInState)).toBe(session);
		});
	});

	describe('hasSessionSelector', () => {
		it('should return true if session exists', () => {
			expect(hasSessionSelector(signedInState)).toBe(!!session);
		});
	});

	describe('selfProfileSelector', () => {
		it('should return user profile object', () => {
			// Profile object shape: {
			//   id, name, pictureHash, email,
			// }
			expect(selfProfileSelector(signedInState)).toEqual({
				id: 190234,
				name: 'user-login',
				pictureHash: '1c1fc3fc-f23c-4b25-9e80-b033f64df9e2',
				email: 'example@test.com',
			});
		});
	});

	describe('selfIdSelector', () => {
		it('should return user id', () => {
			expect(selfIdSelector(signedInState)).toBe(session.id);
		});
	});

	describe('selfNameSelector', () => {
		it('should return user name', () => {
			expect(selfNameSelector(signedInState)).toBe('user-login');
		});
	});

	describe('selfPictureHashSelector', () => {
		it('should return user pictureHash', () => {
			expect(selfPictureHashSelector(signedInState)).toBe(session.pictureHash);
		});
	});

	describe('selfEmailSelector', () => {
		it('should return user email (confirmed or not)', () => {
			expect(selfEmailSelector(signedInState)).toBe(session.emailConfirmed);
		});
	});

	describe('accountTypeSelector', () => {
		it('should return user account type', () => {
			expect(accountTypeSelector(signedInState)).toBe(session.accountType);
		});
	});

	describe('loadingSelector', () => {
		it('should return loading flag', () => {
			expect(loadingSelector(signedInState)).toBe(false);
		});
	});

	describe('errorSelector', () => {
		it('should return module error value', () => {
			expect(errorSelector(signedOutState)).toEqual(signedOutState.auth.error);
		});
	});
});
