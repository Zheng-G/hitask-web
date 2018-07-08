const { PUBLISH } = require('./config/project.config');
const tasks = require('./tasks');

if (PUBLISH) {
	tasks.sendSlackNotification();
}
