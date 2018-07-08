describe('/login (Login page)', () => {
	const {
		BROWSER,
		URL,
		Accounts,
		Viewport,
		timeout, // isDebug,
	} = global;
	let page;

	beforeEach(async () => {
		page = await BROWSER.newPage();
		await page.setViewport({ width: Viewport.width, height: Viewport.height });
		await page.goto(URL);
		await page.evaluate(() => {
			document.cookie = '';
		});
	}, timeout);

	it(
		'should successfully render login form on bootstrap',
		async () => {
			// if (isDebug) {
			// 	await page.screenshot({ path: `screenshots/${new Date().toISOString()}.png` });
			// }
			const formSelector = '[data-test="login-form"]';
			await page.waitForSelector(formSelector, { timeout });
			const formNode = await page.$(formSelector);
			expect(formNode).toBeTruthy();
			const errorNode = await page.$('[data-test="login-error"]');
			expect(errorNode).toBeNull();
		},
		timeout
	);

	it(
		'should stay on login page and show error message, if account credentials are incorrect',
		async () => {
			await page.waitForSelector('[data-test="login-form"]', { timeout });
			await page.type('input[name="login"]', Accounts.main.login);
			await page.type('input[name="password"]', Accounts.main.password.repeat(2));
			const submitButton = await page.$('button[type="submit"]');
			await submitButton.click();
			const selector = '[data-test="login-error"]';
			await page.waitForSelector(selector, { timeout });
			// if (isDebug) {
			// 	await page.screenshot({ path: `screenshots/${new Date().toISOString()}.png` });
			// }
			const node = await page.$(selector);
			expect(node).toBeTruthy();
		},
		timeout
	);

	it(
		'should make successful login with correct account credentials',
		async () => {
			await page.waitForSelector('[data-test="login-form"]', { timeout });
			await page.type('input[name="login"]', Accounts.main.login);
			await page.type('input[name="password"]', Accounts.main.password);
			const submitButton = await page.$('button[type="submit"]');
			await submitButton.click();
			const selector = '[data-test="authorized-container"]';
			await page.waitForSelector(selector, { timeout });
			// if (isDebug) {
			// 	await page.screenshot({ path: `screenshots/${new Date().toISOString()}.png` });
			// }
			const node = await page.$(selector);
			expect(node).toBeTruthy();
		},
		timeout
	);
});
