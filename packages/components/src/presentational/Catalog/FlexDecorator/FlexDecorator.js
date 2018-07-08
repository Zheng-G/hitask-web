import React from 'react';

const FlexDecorator = storyFn => <div style={{ display: 'flex' }}>{storyFn()}</div>;

export default FlexDecorator;
