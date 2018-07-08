/* eslint no-useless-constructor:0 */
const NodeEnvironment = require('jest-environment-node');
const { Application } = require('spectron');
const electronPath = require('electron');
const { paths } = require('@hitask/desktop/build/config/project.config');

class SpectronEnvironment extends NodeEnvironment {
	constructor(config) {
		super(config);
	}

	async setup() {
		await super.setup();
		const app = new Application({
			path: electronPath,
			args: [paths.dist()],
		});
		this.global.APP = app;
	}

	async teardown() {
		await super.teardown();
	}

	runScript(script) {
		return super.runScript(script);
	}
}

module.exports = SpectronEnvironment;
