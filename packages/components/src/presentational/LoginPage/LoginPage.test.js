import React from 'react';
import { shallow } from 'enzyme';
import LoginPage from './LoginPage';
import Form from './_Form';
import ErrorMessage from './_ErrorMessage';
import LoadingThrobber from '../LoadingThrobber';

const emptyFunc = () => {};
describe('LoginPage', () => {
	it('should render sign in form correctly', () => {
		const wrapper = shallow(
			<LoginPage
				handleSubmit={emptyFunc}
				updateLocale={emptyFunc}
				sendGATracking={emptyFunc}
			/>
		);

		expect(wrapper.find(LoadingThrobber).length).toBe(0);
		expect(wrapper.find(Form).length).toBe(1);
	});

	// Test should be moved to <CoreLayout> and <ChromeExtension>
	it.skip('should render nothing except LoadingThrobber when no locales are available', () => {
		const wrapper = shallow(
			<LoginPage
				handleSubmit={emptyFunc}
				updateLocale={emptyFunc}
				sendGATracking={emptyFunc}
				noLocales
			/>
		);

		expect(wrapper.find(LoadingThrobber).length).toBe(1);
		expect(wrapper.find(Form).length).toBe(0);
		expect(wrapper.children().length).toBe(0);
	});

	it('should render error message block, if error occurred, and pass it to ErrorMessage component', () => {
		const message = 'Test error';
		const wrapper = shallow(
			<LoginPage
				handleSubmit={emptyFunc}
				updateLocale={emptyFunc}
				sendGATracking={emptyFunc}
				errorMessage={message}
			/>
		);

		expect(wrapper.find(ErrorMessage).length).toBe(1);
		expect(wrapper.find(ErrorMessage).prop('errorMessage')).toBe(message);
	});

	it('should render loading throbber during login request', () => {
		const wrapper = shallow(
			<LoginPage
				handleSubmit={emptyFunc}
				updateLocale={emptyFunc}
				sendGATracking={emptyFunc}
				loading
			/>
		);

		expect(wrapper.find(LoadingThrobber).length).toBe(1);
	});

	it('should have special class name during login request', () => {
		const wrapper = shallow(
			<LoginPage
				handleSubmit={emptyFunc}
				updateLocale={emptyFunc}
				sendGATracking={emptyFunc}
				loading
			/>
		);

		expect(wrapper.find('.login').hasClass('loadingState')).toBe(true);
	});
});
