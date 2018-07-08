// import ReconnectingWebSocket from 'reconnectingwebsocket'; // Do not use reconnection for now, since it lead to refetching activity feed

const connection = new WebSocket(
	`wss://${__API_BASE_HOST__}/api/v3/activityfeed?limit=64&session_id=${
		'' /* Paste session here */
	}`
);

// When the connection is open, send some data to the server
connection.onopen = () => {
	// console.log('on WebSocket open');
	// connection.send('ping'); // Send the message 'Ping' to the server
	// Send "ping" message to server in order to keep websocket connection alive.
	setInterval(() => {
		try {
			connection.send('ping');
		} catch (e) {
			// console.error(e);
		}
	}, 50000);
};

connection.onmessage = () => {
	// console.log('on WebSocket message');
};

connection.onclose = () => {
	// console.log('on WebSocket close');
};

// Log errors
connection.onerror = error => {
	console.error(`WebSocket Error ${error}`);
};

export default connection;
