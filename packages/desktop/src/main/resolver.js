import path from 'path';

const pathBase = __dirname;
const pathIcons = path.join(pathBase, 'icons');
const pathImages = path.join(pathBase, 'images');
const pathLocales = path.join(pathBase, 'locales');

const paths = {
	base: (...args) => Reflect.apply(path.resolve, null, [pathBase, ...args]),
	icons: (...args) => Reflect.apply(path.resolve, null, [pathIcons, ...args]),
	images: (...args) => Reflect.apply(path.resolve, null, [pathImages, ...args]),
	locales: (...args) => Reflect.apply(path.resolve, null, [pathLocales, ...args]),
};

export default paths;
