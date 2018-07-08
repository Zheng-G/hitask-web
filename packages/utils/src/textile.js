/**
 * @module utils/textile
 */

/**
 * Format line brakes
 * @function
 * @param {String} text string text
 * @return {String} formatted text
 */
export const formatLineBrakes = text => {
	if (!text) return text;
	const formatedText = text.replace(/\n/g, '<br />');
	return formatedText;
};

/**
 * Format Bold Text
 * @function
 * @param {String} text string text
 * @return {String} modified text
 */
const formatBoldText = text => {
	const reg = new RegExp('\\*(.+?)\\*', 'g');
	return text.replace(reg, '<strong>$1</strong>');
};

/**
 * Format Italic Text
 * @function
 * @param {String} text string text
 * @return {String} modified text
 */
const formatItalicText = text => {
	// underscores count as part of a word, so do them separately (make sure not to replace __PRE_BREAK__)
	const reg = new RegExp('\\b_([^_].*?)_\\b', 'g');
	return text.replace(reg, '<em>$1</em>');
};

/**
 * Format Underline Text
 * @function
 * @param {String} text string text
 * @return {String} modified text
 */
const formatUnderlineText = text => {
	const reg = new RegExp('\\+(.+?)\\+', 'g');
	return text.replace(reg, '<ins>$1</ins>');
};

/**
 * Format Superscript Text
 * @function
 * @param {String} text string text
 * @return {String} modified text
 */
const formatSuperscriptText = text => {
	const reg = new RegExp('\\^(.+?)\\^', 'g');
	return text.replace(reg, '<sup>$1</sup>');
};

/**
 * Format Subscript Text
 * @function
 * @param {String} text string text
 * @return {String} modified text
 */
const formatSubscriptText = text => {
	const reg = new RegExp('\\~(.+?)\\~', 'g');
	return text.replace(reg, '<sub>$1</sub>');
};

/**
 * Format Preformatted Text
 * @function
 * @param {String} text string text
 * @return {String} modified text
 */
const formatPreformattedText = text => {
	const textLines = text.split('\n');
	const formatedText = [];
	let prevLineTagName = null;

	textLines.forEach((textLine, index) => {
		const tagName = textLine.indexOf('    ') === 0 ? 'pre' : null;

		if (tagName && (!prevLineTagName || prevLineTagName !== tagName)) {
			formatedText[formatedText.length] = `<pre>${textLine.substr(4)}`;
		} else if (tagName && tagName === prevLineTagName) {
			formatedText[formatedText.length - 1] += `__PRE_BREAK__${textLine.substr(4)}`;
		} else {
			formatedText[formatedText.length] = textLine;
		}

		if (tagName && textLines.length - index === 1)
			formatedText[formatedText.length - 1] += '</pre>';

		if (prevLineTagName && (!tagName || tagName !== prevLineTagName)) {
			formatedText[formatedText.length - 2] += '</pre>';
		}
		prevLineTagName = tagName;
	});
	return formatedText.join('\n');
};

/**
 * Format Blockquote Text
 * @function
 * @param {String} text string text
 * @return {String} modified text
 */
const formatBlockquoteText = text => {
	const textLines = text.split('\n');
	const formatedText = [];
	let prevLineTagName = null;

	textLines.forEach((textLine, index) => {
		const tagName = textLine.indexOf('> ') === 0 ? 'blockquote' : null;

		if (tagName && (!prevLineTagName || prevLineTagName !== tagName)) {
			formatedText[formatedText.length] = `<blockquote>${textLine.substr(2)}`;
		} else if (tagName && tagName === prevLineTagName) {
			formatedText[formatedText.length] = textLine.substr(2);
		} else {
			formatedText[formatedText.length] = textLine;
		}

		if (tagName && textLines.length - index === 1)
			formatedText[formatedText.length - 1] += '</blockquote>';

		if (prevLineTagName && (!tagName || tagName !== prevLineTagName)) {
			formatedText[formatedText.length - 2] += '</blockquote>';
		}
		prevLineTagName = tagName;
	});
	return formatedText.join('\n');
};

/**
 * Format Heading Text
 * @function
 * @param {String} text string text
 * @return {String} modified text
 */
const formatHeadingText = text => {
	let formatedText = text.replace(/(^|\n)h([1-6])\.\s*(.*)?/g, '$1<h$2>$3</h$2>');
	formatedText = formatedText.replace(/(<\/(h1|h2|h3|h4|h5|h6)>)\n/g, '$1');
	return formatedText;
};

/**
 * Format Bullet List
 * @function
 * @param {String} text string text
 * @return {String} modified text
 */
const formatBulletList = text => {
	let formatedText = text.split('\n');
	let isInList = false;

	for (let i = 0; i < formatedText.length; i += 1) {
		let line = formatedText[i].replace(/\s*$/, '');
		if (line.search(/^\s*\*\s+/) !== -1) {
			line = `${line.replace(/^\s*\*\s+/, '<li>')}</li>`;
		}
		formatedText[i] = line;
	}

	for (let i = 0; i < formatedText.length; i += 1) {
		let line = formatedText[i];
		if (isInList && !line.match(/^<li>/)) {
			formatedText[i - 1] += '</ul>';
			break;
		}
		if (isInList && formatedText.length - i === 1) {
			formatedText[i] += '</ul>';
			break;
		}
		if (!isInList && line.match(/^<li>/)) {
			line = line.replace(/<li>/, '<ul><li>');
			isInList = true;
			formatedText[i] = line;
		}
	}

	formatedText = formatedText.join('\n');
	formatedText = formatedText.replace(/<\/li>\n/g, '</li>');
	return formatedText;
};

/**
 * Format Numbered List
 * @function
 * @param {String} text string text
 * @return {String} modified text
 */
const formatNumberedList = text => {
	let formatedText = text.split('\n');
	let isInList = false;

	for (let i = 0; i < formatedText.length; i += 1) {
		let line = formatedText[i].replace(/\s*$/, '');

		if (line.search(/^\s*#\s+/) !== -1) {
			line = `${line.replace(/^\s*#\s+/, '<li>')}</li>`;
		}
		formatedText[i] = line;
	}

	for (let i = 0; i < formatedText.length; i += 1) {
		let line = formatedText[i];
		if (isInList && !line.match(/^<li>/)) {
			formatedText[i - 1] += '</ol>';
			break;
		}
		if (isInList && formatedText.length - i === 1) {
			formatedText[i] += '</ol>';
			break;
		}
		if (!isInList && line.match(/^<li>/)) {
			line = line.replace(/<li>/, '<ol><li>');
			isInList = true;
			formatedText[i] = line;
		}
	}

	formatedText = formatedText.join('\n');
	formatedText = formatedText.replace(/<\/li>\n/g, '</li>');
	return formatedText;
};

/**
 * Format message according textile rules
 * See https://gitlab.com/hitask/hitask-web/issues/72
 * @function
 * @param {String} message string message
 * @return {String} modified message
 */
export const formatText = message => {
	if (!message) return '';
	let formatedText = message;

	// Unescape quote block
	formatedText = formatedText.replace(/(^|\n)&gt;/g, '$1>');
	formatedText = formatBoldText(formatedText);
	formatedText = formatItalicText(formatedText);
	formatedText = formatUnderlineText(formatedText);
	formatedText = formatHeadingText(formatedText);
	formatedText = formatSuperscriptText(formatedText);
	formatedText = formatSubscriptText(formatedText);
	formatedText = formatPreformattedText(formatedText);
	formatedText = formatBlockquoteText(formatedText);
	formatedText = formatBulletList(formatedText);
	formatedText = formatNumberedList(formatedText);

	// Line breaks
	formatedText = formatLineBrakes(formatedText);

	// Pre new lines shouldn't be converted to <br />
	formatedText = formatedText.replace(/__PRE_BREAK__/g, '\n');

	return formatedText;
};
