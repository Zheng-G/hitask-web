import moment from 'moment-timezone';
import TimerManager from '../src/TimerManager';

const TickEvent = {
	MIN: 0, // every minute. Minimum app tick
	QUARTER: 1, // every 15 mins
	HALF_HOUR: 2, // every 30 mins
	HOUR: 3, // every hour
	MIDDAY: 4, // every 12 hours
	DAY: 5, // every 24 hours
};

const expectValueToBeCloseToExpected = (value, expected, epsilon) => {
	expect(Math.abs(value - expected)).toBeLessThanOrEqual(epsilon);
};

const waitUntilNextMinute = () => {
	const now = moment();
	const timeToNextMinute = 60 * 1000 - now.seconds() - now.milliseconds();
	jest.advanceTimersByTime(timeToNextMinute);
};

// Read docs at https://facebook.github.io/jest/docs/en/timer-mocks.html
describe('Utils.timerManager', () => {
	jest.useFakeTimers();
	const minTickInterval = 60 * 1000;
	let timer;

	afterEach(() => {
		if (timer) {
			timer = null;
		}
		jest.clearAllTimers();
	});

	describe('without tick emitter', () => {
		describe('constructor', () => {
			it('should not emit tick events if tickEmitter is disabled', () => {
				timer = new TimerManager(false);
				expect(setTimeout).not.toBeCalled();
				expect(setInterval).not.toBeCalled();
				jest.runOnlyPendingTimers();
				expect(setTimeout).not.toBeCalled();
				expect(setInterval).not.toBeCalled();
			});
		});

		describe('setTimer method', () => {
			it('should save provided timer', () => {
				const timerId = 'timerId';
				timer = new TimerManager(false);
				timer.setTimer(timerId, 1000, () => {});
				expect(timer.timers[timerId]).toBeDefined();
			});

			it('should call timer handler once, pass event time and timeout as arguments', () => {
				const timerId = 'timerId';
				const timeout = 1000;
				let timerTimeout = null;
				const callback = jest.fn().mockImplementation((eventTime, eventTimeout) => {
					timerTimeout = eventTimeout;
				});
				timer = new TimerManager(false);
				timer.setTimer(timerId, timeout, callback);

				expect(callback).not.toBeCalled();
				jest.advanceTimersByTime(timeout);
				expect(callback).toHaveBeenCalledTimes(1);
				expect(callback).toBeCalledWith(expect.any(Date), expect.any(Number));
				expect(timerTimeout).toBe(timeout);
			});

			it('should accept Date-type timeout', () => {
				const now = moment();
				const tomorrow = now.add(1, 'day');
				const timeout = 24 * 60 * 60 * 1000; // 24 hours
				const expectedTimeout = timeout;
				const acceptableDiff = 1; // actual result must not differ from expected more than 1 ms
				let timerTimeout = null;
				const callback = jest.fn().mockImplementation((eventTime, eventTimeout) => {
					timerTimeout = eventTimeout;
				});
				timer = new TimerManager(false);
				timer.setTimer('timerId', tomorrow, callback);

				expect(callback).not.toBeCalled();
				jest.advanceTimersByTime(timeout);
				expect(callback).toHaveBeenCalledTimes(1);
				expect(callback).toBeCalledWith(expect.any(Date), expect.any(Number));
				expectValueToBeCloseToExpected(timerTimeout, expectedTimeout, acceptableDiff);
			});
		});

		describe('setRecurringTimer method', () => {
			it('should save provided timer', () => {
				const timerId = 'timerId';
				timer = new TimerManager(false);
				timer.setRecurringTimer(timerId, 1000, () => {});
				expect(timer.timers[timerId]).toBeDefined();
			});

			it('should repeat event on each interval', () => {
				const timerId = 'timerId';
				const interval = 1000;
				let lastCallOffset = null;
				const callback = jest.fn().mockImplementation((eventTime, offset) => {
					lastCallOffset = offset;
				});
				timer = new TimerManager(false);
				timer.setRecurringTimer(timerId, interval, callback);

				expect(callback).toHaveBeenCalledTimes(1); // First event is emitted instantly, if lastCallTime not provided
				expect(callback).toHaveBeenLastCalledWith(expect.any(Date), expect.any(Number));
				expect(lastCallOffset).toBe(0);

				jest.advanceTimersByTime(interval);
				expect(callback).toHaveBeenCalledTimes(2);
				expect(callback).toHaveBeenLastCalledWith(expect.any(Date), expect.any(Number));
				expect(lastCallOffset).toBe(interval);

				jest.advanceTimersByTime(interval);
				expect(callback).toHaveBeenCalledTimes(3);
				expect(callback).toHaveBeenLastCalledWith(expect.any(Date), expect.any(Number));
				expect(lastCallOffset).toBe(interval);
				// ...
			});

			it('should calculate time to first event based on passed lastCallTime', () => {
				const timerId = 'timerId';
				const interval = 5 * 1000;
				const lastCallTime = moment().subtract(1, 'second');
				const expectedFirstCallOffset = 4 * 1000; // interval minus 1 second since last call
				const acceptableDiff = 1;
				let lastCallOffset = null;
				const callback = jest.fn().mockImplementation((eventTime, offset) => {
					lastCallOffset = offset;
				});
				timer = new TimerManager(false);
				timer.setRecurringTimer(timerId, interval, callback, lastCallTime);

				jest.advanceTimersByTime(interval);
				expect(callback).toHaveBeenCalledTimes(1);
				// First event must have close offset to expectedFirstCallOffset
				expectValueToBeCloseToExpected(
					lastCallOffset,
					expectedFirstCallOffset,
					acceptableDiff
				);

				jest.advanceTimersByTime(interval);
				expect(callback).toHaveBeenCalledTimes(2);
				expect(lastCallOffset).toBe(interval); // Second event must have interval offset

				jest.advanceTimersByTime(interval);
				expect(callback).toHaveBeenCalledTimes(3);
				expect(lastCallOffset).toBe(interval); // Third event must have interval offset
				// ...
			});
		});

		describe('removeTimer method', () => {
			it('should remove existing timer by id', () => {
				const timerId = 'timerId';
				timer = new TimerManager(false);
				timer.setTimer(timerId, 1000, () => {});
				timer.removeTimer(timerId);
				expect(timer.timers[timerId]).toBeUndefined();
			});

			it('should prevent new recently added timer from call', () => {
				const timerId = 'timerId';
				const timeout = 1000;
				const callback = jest.fn();
				timer = new TimerManager(false);
				timer.setTimer(timerId, 1000, callback);
				timer.removeTimer(timerId);
				jest.advanceTimersByTime(timeout);
				expect(callback).not.toBeCalled();
			});
		});

		describe('removeAllTimers method', () => {
			it('should empty timers and subscribers list', () => {
				const timerId1 = 12345;
				const timer1Callback = jest.fn();
				const timerId2 = 12346;
				const timer2Callback = jest.fn();
				const subscriberId = 11111;
				const subscriberCallback = jest.fn();
				timer = new TimerManager(false);
				timer.setTimer(timerId1, 1000, timer1Callback);
				timer.setTimer(timerId2, 2000, timer2Callback);
				timer.subscribe(subscriberId, TickEvent.MIN, subscriberCallback);
				timer.removeAllTimers();
				expect(Object.keys(timer.timers)).toHaveLength(0);
				expect(Object.keys(timer.subscribers)).toHaveLength(0);
				jest.runOnlyPendingTimers();
				expect(timer1Callback).not.toBeCalled();
				expect(timer2Callback).not.toBeCalled();
				expect(subscriberCallback).not.toBeCalled();
			});
		});
	});

	describe('with tick emitter', () => {
		describe('constructor', () => {
			it('should call startCallback passed to constructor with the first tick in less than a minute and pass start time as an argument', () => {
				let timeToFirstTickEvent = null;
				const callback = jest.fn().mockImplementation((startTime, timeToFirstTick) => {
					timeToFirstTickEvent = timeToFirstTick;
				});
				timer = new TimerManager(true, callback);

				expect(callback).not.toBeCalled();
				jest.advanceTimersByTime(60 * 1000); // Fast-forward 1 minute
				expect(callback).toBeCalled();
				expect(callback).toHaveBeenCalledTimes(1);
				expect(callback).toBeCalledWith(expect.any(Date), expect.any(Number));
				expect(timeToFirstTickEvent).toBeLessThan(minTickInterval);
			});
		});

		describe('subscribe method', () => {
			it('should save provided subscriber', () => {
				const subscriberId = 'subscriberId';
				const callback = jest.fn();
				timer = new TimerManager();
				timer.subscribe(subscriberId, TickEvent.MIN, callback);

				expect(timer.subscribers[subscriberId]).toBeDefined();
				const subscriber = timer.subscribers[subscriberId];
				expect(subscriber.id).toBe(subscriberId);
				expect(subscriber.tickType).toBe(TickEvent.MIN);
				expect(subscriber.handler).toBe(callback);
			});
		});

		describe('stopTicksEmitter', () => {
			it('should prevent tick event emitting', () => {
				const callback = jest.fn();
				timer = new TimerManager();
				timer.subscribe('subscriberId', TickEvent.MIN, callback);
				timer.stopTicksEmitter();
				jest.runAllTimers();
				expect(callback).not.toBeCalled();
			});
		});

		it('should emit MIN tick each minute', () => {
			const tickType = TickEvent.MIN;
			const subscriberId = 'subscriberId';
			const interval = 1000 * 60; // 1 min
			const callback = jest.fn();
			const testTickEvents = (leftIntervals, passedIntervals) => {
				jest.advanceTimersByTime(interval); // Fast-forward 1 interval
				expect(callback).toHaveBeenCalledTimes(passedIntervals + 1);
				expect(callback).toBeCalledWith(expect.any(Date));
				if (leftIntervals > 1) {
					testTickEvents(leftIntervals - 1, passedIntervals + 1);
				}
			};

			timer = new TimerManager(); // eslint-disable-line no-param-reassign
			timer.subscribe(subscriberId, tickType, callback);
			const intervalsAmountToTest = 4;
			let leftIntervals = intervalsAmountToTest;
			let passedIntervals = 0;

			expect(callback).not.toBeCalled(); // Need to wait for the next minute
			waitUntilNextMinute();

			if (tickType === TickEvent.MIN) {
				expect(callback).toHaveBeenCalledTimes(1); // MIN tick must be emitted on the next minute
				expect(callback).toBeCalledWith(expect.any(Date));
				leftIntervals -= 1;
				passedIntervals += 1;
			}

			testTickEvents(leftIntervals, passedIntervals);
		});

		// TODO: cover other tick events with tests
	});
});
