const axios = require('axios');
const debug = require('debug')('*');

const Webhooks = {
	webapp: 'https://hooks.slack.com/services/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',
};

exports.slackWebappNotification = ({ body }) => {
	const webhookUrl = Webhooks.webapp;
	const headers = {
		'Content-Type': 'application/json',
	};

	debug('- Send Slack notification');
	return axios({
		method: 'post',
		url: webhookUrl,
		data: body,
		headers,
		timeout: 20000,
	});
};
