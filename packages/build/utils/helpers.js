exports.loadSecretEnvGlobal = (env, { name, targetName, errorMsg = '', strict = true }) => {
	if (!name) return env;
	env[targetName || name] = process.env[name] || null;
	if (!env[targetName || name]) {
		const message = `${name} param is empty. ${errorMsg}`;
		if (strict) {
			console.error(`ERROR: ${message}`);
			process.exit(1);
		} else {
			console.warn(`WARNING: ${message}`);
		}
	}
	return env;
};

exports.compileHandler = (resolve, reject, err, stats) => {
	if (err) {
		return reject(err);
	}

	const jsonStats = stats.toJson();

	if (stats.hasErrors()) {
		return reject(jsonStats.errors);
	}

	if (stats.hasWarnings()) {
		console.warn(jsonStats.warnings.join('\n'));
	}

	return resolve(jsonStats);
};
