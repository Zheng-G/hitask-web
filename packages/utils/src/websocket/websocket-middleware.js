/**
 * Allows you to register actions that when dispatched, send the action to the
 * server via a WebSocket.
 */
import { createAction } from 'redux-actions';

const WEBSOCKET_ON_MESSAGE = 'WEBSOCKET_ON_MESSAGE';
const webSocketOnMessage = createAction(WEBSOCKET_ON_MESSAGE);
const WEBSOCKET_SEND = 'WEBSOCKET_SEND';
export const webSocketSend = createAction(WEBSOCKET_SEND);

export default function createWebSocketMiddleware(socket) {
	return ({ dispatch }) => {
		// Wire WebSocket to dispatch actions sent by the server.
		socket.onmessage = e => dispatch(webSocketOnMessage(e));

		return next => action => {
			const { type, payload } = action;

			if (type === WEBSOCKET_SEND) {
				socket.send(payload);
			}

			return next(action);
		};
	};
}
