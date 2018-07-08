/* eslint no-console:0 */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.text());

app.post('*', (req, res) => {
	console.log(req.body);
	res.send(req.body);
});

const port = 3006;
app.listen(port, () => {
	console.log(`- Performance monitor server is now running on http://localhost:${port}`);
});
