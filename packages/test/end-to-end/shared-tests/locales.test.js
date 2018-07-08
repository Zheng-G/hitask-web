const checkKey = (localesHash, key, keyChain) => {
	const names = key.split('.');
	const testName = names[0];
	if (!localesHash[testName])
		throw new Error(`KeyName ${testName} from ${keyChain} not found among translations`);
	if (typeof localesHash[testName] === 'string') return true;
	return checkKey(localesHash[testName], names.slice(1).join('.'), keyChain);
};

describe('Locales', () => {
	const { localesHash, usedTranslationKeys } = global;
	const testLocales = Object.keys(localesHash);

	it('should fail check with wrong key', () => {
		const fakeKey = 'fake_translation_key';
		testLocales.forEach(locale => {
			expect(() => checkKey(localesHash[locale], fakeKey, fakeKey)).toThrowError();
		});

		const fakeNestedKey = 'hi.fake_translation_key.test';
		testLocales.forEach(locale => {
			expect(() =>
				checkKey(localesHash[locale], fakeNestedKey, fakeNestedKey)
			).toThrowError();
		});
	});

	it('should contain all used keys', () => {
		testLocales.forEach(locale => {
			usedTranslationKeys.forEach(key => {
				expect(checkKey(localesHash[locale], key, key)).toBe(true);
			});
		});
	});
});
