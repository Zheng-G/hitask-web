describe('Desktop login page', () => {
	const { APP, timeout, Accounts } = global;

	beforeEach(async () => APP.start(), timeout);

	afterEach(async () => {
		await APP.client.localStorage('DELETE');
		return APP.stop();
	}, timeout);

	it(
		'should show an initial window',
		async () => {
			const page = APP.client;
			const count = await page.getWindowCount();
			expect(count).toBe(1);
		},
		timeout
	);

	it(
		'should successfully render login form on bootstrap',
		async () => {
			const page = APP.client;
			const { value: formNode } = await page.element('[data-test="login-form"]');
			expect(formNode).toBeTruthy();
			const { value: errorNode } = await page.element('[data-test="login-error"]');
			expect(errorNode).toBeNull();
		},
		timeout
	);

	it(
		'should stay on login page and show error message, if account credentials are incorrect',
		async () => {
			const page = APP.client;
			const { value: formNode } = await page.element('[data-test="login-form"]');
			expect(formNode).toBeTruthy();
			await page.setValue('input[name="login"]', Accounts.main.login);
			await page.setValue('input[name="password"]', Accounts.main.password.repeat(2));
			await page.click('button[type="submit"]');
			const errorSelector = '[data-test="login-error"]';
			await page.waitForExist(errorSelector, timeout);
			const { value: errorNode } = await page.element(errorSelector);
			expect(errorNode).toBeTruthy();
		},
		timeout
	);

	it(
		'should make successful login with correct account credentials',
		async () => {
			const page = APP.client;
			const { value: formNode } = await page.element('[data-test="login-form"]');
			expect(formNode).toBeTruthy();
			await page.setValue('input[name="login"]', Accounts.main.login);
			await page.setValue('input[name="password"]', Accounts.main.password);
			await page.click('button[type="submit"]');
			const protectedAppSelector = '[data-test="authorized-container"]';
			await page.waitForExist(protectedAppSelector, timeout);
			const { value: appPage } = await page.element(protectedAppSelector);
			expect(appPage).toBeTruthy();
		},
		timeout
	);
});
