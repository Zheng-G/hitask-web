const webpack = require('webpack');
const debug = require('debug')('desktop:build-main:prod');
const { compileHandler } = require('@hitask/build/utils/helpers');
const webpackConfig = require('./config/webpack.config.main');

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

compile();
