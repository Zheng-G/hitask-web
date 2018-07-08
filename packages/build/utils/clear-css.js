/* eslint no-console:0 */
/*
const path = require('path');
const fs = require('fs');
const cssSelectorExtract = require('css-selector-extract');

const PATHS = [
	path.join(__dirname, '../../node_modules/@hitask/blueprint-core/dist/blueprint'),
	path.join(__dirname, '../../node_modules/@hitask/blueprint-labs/dist/blueprint-labs'),
	path.join(__dirname, '../../node_modules/@hitask/blueprint-table/dist/table'),
];

PATHS.forEach(PATH => {
	const SRC_PATH = `${PATH}.css`;
	const BACKUP_PATH = `${PATH}-origin.css`;
	const css = fs.readFileSync(SRC_PATH, 'utf8');
	fs.writeFileSync(BACKUP_PATH, css, 'utf8');

	const options = {
		css,
		// Array of selectors which should get extracted
		// Leave only class selectors, excluding .pt-dark
		filters: [/^\w*\.(?!pt-dark)/],
	};

	const extractedCss = cssSelectorExtract.processSync(options);
	fs.writeFileSync(SRC_PATH, extractedCss, 'utf8');
	console.log(`${SRC_PATH}: global and .pt-dark selectors were removed`);
});
*/
