import { reduceUnitsUnderSameTime } from '../../src/items/history.logic';

describe('Modules.items module, itemHistory', () => {
	describe('reduceUnitsUnderSameTime', () => {
		const testArray = [
			{
				id: 1234,
				userName: 'first',
				time: '2017-05-04T11:07:00.000+00:00',
				value: 'value1',
			},
			{
				id: 1235,
				userName: 'first',
				time: '2017-05-22T19:49:00.000+00:00',
				value: 'value2',
			},
			{
				id: 1236,
				userName: 'first',
				time: '2017-05-22T19:49:00.000+00:00',
				value: 'value3',
			},
			{
				id: 1237,
				userName: 'second',
				time: '2017-05-22T19:49:00.000+00:00',
				value: 'value4',
			},
		];
		const expectedArray = [
			{
				id: 1234,
				userName: 'first',
				time: '2017-05-04T11:07:00.000+00:00',
				value: 'value1',
			},
			{
				id: 1235,
				userName: 'first',
				time: '2017-05-22T19:49:00.000+00:00',
				value: 'value2\nvalue3',
			},
			{
				id: 1237,
				userName: 'second',
				time: '2017-05-22T19:49:00.000+00:00',
				value: 'value4',
			},
		];
		it('should return reduced array', () => {
			expect(reduceUnitsUnderSameTime(testArray)).toEqual(expectedArray);
		});
	});
});
