import { renameObjectKeys, formatObjectTypes } from '../src/helpers';

describe('Utils.helpers', () => {
	describe('renameObjectKeys', () => {
		const testObj = {
			foo: 1,
			bar: 2,
			far: 3,
		};
		const testRenameMap = {
			foo: 'foo2',
			bar: 'bar2',
		};
		const expectedObj = {
			foo2: 1,
			bar2: 2,
			far: 3,
		};

		it('should rename object key according rename map', () => {
			expect(renameObjectKeys(testObj, testRenameMap)).toEqual(expectedObj);
		});
	});

	describe('formatObjectTypes', () => {
		const testObj = {
			number: '123',
			bool: 'true',
			string: 'some string',
			array: '[1, 2, 3]',
			object: '{ "foo": "bar" }',
			correctObject: {
				bar: 'foo',
			},
		};
		const testShape = {
			number: 'NUMBER',
			bool: 'BOOL',
			string: 'STRING',
			array: 'ARRAY',
			object: 'OBJECT',
		};
		const expectedObj = {
			number: 123,
			bool: true,
			string: 'some string',
			array: [1, 2, 3],
			object: { foo: 'bar' },
			correctObject: {
				bar: 'foo',
			},
		};

		it('should format object properties according shape', () => {
			expect(formatObjectTypes(testObj, testShape)).toEqual(expectedObj);
		});
	});
});
