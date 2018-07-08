const { history } = require('./history.json');

const generator = () => history;
// .map((historyItem) => {
// 	historyItem.id = parseInt(id, 10);
// 	return historyItem;
// });

module.exports = generator;
