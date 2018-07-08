const electron = require('electron');
const webpack = require('webpack');
const debug = require('debug')('desktop:build-main:dev');
const { spawn } = require('child_process');
const { compileHandler } = require('@hitask/build/utils/helpers');
const { paths } = require('./config/project.config');
const webpackConfig = require('./config/webpack.config.main');
const tasks = require('./tasks');

const compile = () =>
	new Promise((resolve, reject) => {
		debug('- Start webpack main build');
		webpack(webpackConfig, (err, stats) => {
			compileHandler(resolve, reject, err, stats);
		});
	}).catch(err => {
		console.error(err);
		process.exit(1);
	});

const startElectron = () => {
	debug('- Start electron');
	spawn(electron, [paths.dist('main')], {
		shell: true,
		env: process.env,
		stdio: 'inherit',
	})
		.on('close', code => process.exit(code))
		.on('error', error => console.error(error));
};

tasks.putUpdateParams();
compile().then(() => {
	debug('- Electron dev build finished');
	startElectron();
});
