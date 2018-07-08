const webpack = require('webpack');
const debug = require('debug')('desktop:build-renderer:prod');
const { compileHandler } = require('@hitask/build/utils/helpers');
const webpackConfig = require('./config/webpack.config.renderer');

const compile = () =>
	new Promise((resolve, reject) => {
		debug('- Start webpack renderer build');
		webpack(webpackConfig, (err, stats) => {
			compileHandler(resolve, reject, err, stats);
		});
	}).catch(err => {
		console.error(err);
		process.exit(1);
	});

compile();
