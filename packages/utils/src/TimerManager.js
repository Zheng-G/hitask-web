/**
 * @module utils/timerManager
 */
import moment from 'moment-timezone';
import { TickEvent } from '@hitask/constants/timer';

class TimerManager {
	/**
	 * @constructs
	 * @param {Boolean} [enableTicksEmitter = true] if false, TimerManager will not emit tick events
	 * @param {Function} [startCallback] callback, that will be called on first tick event.
	 *   Receives startTime (Moment) and timeToFirstTick (Number) as arguments
	 */
	constructor(enableTicksEmitter = true, startCallback) {
		this.minTickInterval = 60 * 1000;
		this.timers = {};
		this.subscribers = {};
		if (enableTicksEmitter) {
			const now = moment();
			const timeToFirstTick =
				this.minTickInterval - now.seconds() * 1000 - now.milliseconds();
			this.startTimeoutId = setTimeout(() => {
				const startTime = moment();
				this._startTicksEmitter(startTime);
				if (startCallback) {
					startCallback(startTime.toDate(), timeToFirstTick);
				}
			}, timeToFirstTick);
		}
	}

	// -------------------------------
	// Public API:
	// -------------------------------

	/**
	 * Set single timeout. Not synchronized with app ticks
	 * @function
	 * @param {String|Number} timerId unique id for the timer
	 * @param {Moment|Date|Number} targetTime timeout, relative (Number) or absolute (Date/Moment)
	 * @param {Function} handler timeout callback, receives eventTime (Date) and timerTimeout (Number) as arguments
	 * @return {Void} void
	 */
	setTimer(timerId, targetTime, handler) {
		const now = moment();
		const timeoutMilliseconds =
			typeof targetTime === 'number' ? targetTime : moment(targetTime).diff(now);
		if (timeoutMilliseconds > 0) {
			this.timers[timerId] = setTimeout(
				() => handler(moment().toDate(), timeoutMilliseconds),
				timeoutMilliseconds
			);
		}
	}

	/**
	 * Set recurring timeout. Not synchronized with app ticks
	 * @function
	 * @param {String|Number} timerId unique id for the timer
	 * @param {Number} interval recurring interval in milliseconds
	 * @param {Function} handler timeout callback, receives eventTime (Date) and
	 *   lastCallOffset (Number, time from last event or timer setup, in ms)
	 * @param {Moment|Date|Number} [lastCallTime] time when last event was emitted.
	 *   If provided, next event timeout will be calculated to keep interval length
	 * @return {Void} void
	 */
	setRecurringTimer(timerId, interval, handler, lastCallTime) {
		const now = moment();
		if (lastCallTime) {
			let timeFromLastCall = moment(now).diff(lastCallTime);
			if (timeFromLastCall < 0) {
				console.error(
					`Provided lastCallTime (${lastCallTime.toString()}) can not be in future`
				);
				timeFromLastCall = interval;
			}
			const startTimeout = Math.max(interval - timeFromLastCall, 0);
			if (startTimeout > 0) {
				setTimeout(() => {
					const startTime = moment();
					handler(startTime.toDate(), startTimeout); // Emit first event
					this._startRecurringTimer(timerId, interval, handler);
				}, startTimeout);
			} else {
				handler(now.toDate(), 0); // Emit first event
				this._startRecurringTimer(timerId, interval, handler);
			}
		} else {
			handler(now.toDate(), 0); // Emit first event
			this._startRecurringTimer(timerId, interval, handler);
		}
	}

	/**
	 * Set tick subscriber. Synchronized with app ticks
	 * @function
	 * @param {String|Number} timerId unique id for the timer
	 * @param {Number} tickType type of tick event to observe
	 * @param {Function} handler timeout callback, receives call time (Date) as the first argument
	 * @return {Void} void
	 */
	subscribe(timerId, tickType, handler) {
		this.subscribers[timerId] = { id: timerId, handler, tickType };
	}

	/**
	 * Remove existing timer by id
	 * @function
	 * @param {String|Number} timerId unique id for the timer
	 * @return {Void} void
	 */
	removeTimer(timerId) {
		clearTimeout(this.timers[timerId]);
		clearInterval(this.timers[timerId]);
		delete this.timers[timerId];
		delete this.subscribers[timerId];
	}

	/**
	 * Remove all existing timers
	 * @function
	 * @return {Void} void
	 */
	removeAllTimers() {
		Object.keys(this.timers).forEach(this.removeTimer.bind(this));
		Object.keys(this.subscribers).forEach(this.removeTimer.bind(this));
	}

	/**
	 * Stop emitting tick events
	 * @function
	 * @return {Void} void
	 */
	stopTicksEmitter() {
		clearTimeout(this.startTimeoutId);
		clearInterval(this.tickEmitterId);
	}

	// -------------------------------
	// Private methods:
	// -------------------------------

	/**
	 * Start interval timer and save it
	 * @function
	 * @access private
	 * @param {String|Number} timerId timer id
	 * @param {Number} interval recurring interval
	 * @param {Function} handler callback function
	 * @return {Void} void
	 */
	_startRecurringTimer(timerId, interval, handler) {
		this.timers[timerId] = setInterval(() => {
			handler(moment().toDate(), interval);
		}, interval);
	}

	/**
	 * Start emitting tick events
	 * @function
	 * @access private
	 * @param {Moment} startTime moment of first tick event
	 * @return {Void} void
	 */
	_startTicksEmitter(startTime) {
		this._emitTickEvents(startTime); // Emit first tick
		this.tickEmitterId = setInterval(() => {
			const tickTime = moment();
			this._emitTickEvents(tickTime);
		}, this.minTickInterval);
	}

	/**
	 * Emit tick events
	 * @function
	 * @access private
	 * @param {Moment} tickTime moment of tick
	 * @return {Void} void
	 */
	_emitTickEvents(tickTime) {
		if (this._needToEmitTickEvent(TickEvent.MIN, tickTime)) {
			this._handleTick(TickEvent.MIN, tickTime);
		}
		if (this._needToEmitTickEvent(TickEvent.QUARTER, tickTime)) {
			this._handleTick(TickEvent.QUARTER, tickTime);
		}
		if (this._needToEmitTickEvent(TickEvent.HALF_HOUR, tickTime)) {
			this._handleTick(TickEvent.HALF_HOUR, tickTime);
		}
		if (this._needToEmitTickEvent(TickEvent.HOUR, tickTime)) {
			this._handleTick(TickEvent.HOUR, tickTime);
		}
		if (this._needToEmitTickEvent(TickEvent.MIDDAY, tickTime)) {
			this._handleTick(TickEvent.MIDDAY, tickTime);
		}
		if (this._needToEmitTickEvent(TickEvent.DAY, tickTime)) {
			this._handleTick(TickEvent.DAY, tickTime);
		}
	}

	/**
	 * Whether particular tick event must be emitted
	 * @function
	 * @access private
	 * @param {tickType} tickType id of tick event
	 * @param {Moment} tickTime moment of tick
	 * @return {Boolean} must be emitted or not
	 */
	_needToEmitTickEvent = (tickType, tickTime) => {
		const minutes = tickTime.minutes();
		const hours = tickTime.hours();
		switch (tickType) {
			case TickEvent.MIN:
				return true;
			case TickEvent.QUARTER:
				return minutes % 15 === 0;
			case TickEvent.HALF_HOUR:
				return minutes % 30 === 0;
			case TickEvent.HOUR:
				return minutes === 0;
			case TickEvent.MIDDAY:
				return minutes === 0 && hours % 12 === 0;
			case TickEvent.DAY:
				return minutes === 0 && hours % 24 === 0;
			default:
				return false;
		}
	};

	/**
	 * Call subscribers of target tick
	 * @function
	 * @access private
	 * @param {tickType} tickType id of tick event
	 * @param {Moment} tickTime moment of tick
	 * @return {Void} void
	 */
	_handleTick(tickType, tickTime) {
		const tickTimeDate = tickTime.toDate();
		Object.keys(this.subscribers).forEach(eventId => {
			const subscriber = this.subscribers[eventId];

			if (subscriber.tickType === tickType) {
				subscriber.handler(tickTimeDate);
			}
		});
	}
}

export default TimerManager;
