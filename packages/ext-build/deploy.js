const tasks = require('./tasks');

tasks
	.uploadAndPublish()
	.then(() => {
		tasks.sendSlackNotification();
	})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
