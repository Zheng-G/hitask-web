import { formatText } from '../src/textile';

describe('Utils.textile', () => {
	describe('formatText', () => {
		it('should pass simple text', () => {
			const srcText = 'Simple text';
			const formattedText = formatText(srcText);
			expect(formattedText).toEqual(srcText);
		});

		it('should render bold text', () => {
			const formattedText = formatText('*Bold text*');
			expect(formattedText).toEqual('<strong>Bold text</strong>');
		});

		it('should render italic text', () => {
			const formattedText = formatText('_Italic text_');
			expect(formattedText).toEqual('<em>Italic text</em>');
		});

		it('should render underline text', () => {
			const formattedText = formatText('+Underline text+');
			expect(formattedText).toEqual('<ins>Underline text</ins>');
		});

		it('should render <h1> heading', () => {
			const formattedText = formatText('h1.Heading text');
			expect(formattedText).toEqual('<h1>Heading text</h1>');
		});

		it('should render bullet list', () => {
			const formattedText = formatText('* bullet list\n* bullet list');
			expect(formattedText).toEqual('<ul><li>bullet list</li><li>bullet list</li></ul>');
		});

		it('should render numbered list', () => {
			const formattedText = formatText('# numbered list\n# numbered list');
			expect(formattedText).toEqual('<ol><li>numbered list</li><li>numbered list</li></ol>');
		});

		it('should render blockquote', () => {
			const formattedText = formatText('> blockquote\n> blockquote');
			expect(formattedText).toEqual('<blockquote>blockquote<br />blockquote</blockquote>');
		});

		it('should render preformatted text', () => {
			const formattedText = formatText('    Preformatted text\n    Second line');
			expect(formattedText).toEqual('<pre>Preformatted text\nSecond line</pre>');
		});

		it('should render superscript text', () => {
			const formattedText = formatText('^Superscript text^');
			expect(formattedText).toEqual('<sup>Superscript text</sup>');
		});

		it('should render subscript text', () => {
			const formattedText = formatText('~Subscript text~');
			expect(formattedText).toEqual('<sub>Subscript text</sub>');
		});

		it('should render bold italic text', () => {
			const formattedText = formatText('_*Bold italic text*_');
			expect(formattedText).toEqual('<em><strong>Bold italic text</strong></em>');
		});

		it('should render bold underline text', () => {
			const formattedText = formatText('+*Bold underline text*+');
			expect(formattedText).toEqual('<ins><strong>Bold underline text</strong></ins>');
		});

		it('should save the amount of lines', () => {
			const reg = /\r\n|\r|\n|<br/;
			const sourceText = `
				First line
				Second line
				Third line`;
			const formattedText = formatText(sourceText);

			expect(formattedText.split(reg).length).toEqual(sourceText.split(reg).length);
		});

		it('should render combined multiline text', () => {
			const sourceText = `*Bold text*
_Italic text_
+Underline text+
h1.Heading text

* bullet list
* bullet list
# numbered list
# numbered list
> blockquote
> blockquote
    Preformatted text
    Second line
^Superscript text^
~Subscript text~
_*Bold italic text*_
+*Bold underline text*+`;
			const formattedText = formatText(sourceText);

			expect(formattedText).toEqual(
				'<strong>Bold text</strong><br />' +
					'<em>Italic text</em><br />' +
					'<ins>Underline text</ins><br />' +
					'<h1>Heading text</h1><br />' +
					'<ul><li>bullet list</li><li>bullet list</li></ul><br />' +
					'<ol><li>numbered list</li><li>numbered list</li></ol><br />' +
					'<blockquote>blockquote<br />blockquote</blockquote><br />' +
					'<pre>Preformatted text\nSecond line</pre><br />' +
					'<sup>Superscript text</sup><br />' +
					'<sub>Subscript text</sub><br />' +
					'<em><strong>Bold italic text</strong></em><br />' +
					'<ins><strong>Bold underline text</strong></ins>'
			);
		});
	});
});
