import React from 'react';
import { storiesOf } from '@storybook/react';
import MarkdownText from './MarkdownText';

storiesOf('Item View/MarkdownText', module).add('default', () => (
	<MarkdownText
		itemId={0}
		text={`*Bold text*
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
+*Bold underline text*+`}
	/>
));
