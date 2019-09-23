import fs from 'fs';

import { loader } from 'webpack';
import { getOptions, interpolateName } from 'loader-utils';
import probe from 'probe-image-size';

interface ImageData {
	src: string;
	width: number;
	height: number;
	bytes?: number;
	type: string;
	[other: string]: any;
}

const imageToString = function(image: ImageData): string {
	// For requires from CSS when used with webpack css-loader,
	// outputting an Object doesn't make sense,
	// So overriding the toString method to output just the URL

	const image_src = `__webpack_public_path__ + ${JSON.stringify(image.src)}`;
	return `module.exports = {
		src: ${image_src},
		width:  ${JSON.stringify(image.width)},
		height:  ${JSON.stringify(image.height)},
		type:  ${JSON.stringify(image.type)},
		};
		module.exports.toString = function() {
			return ${image_src};
		};`;
};

const loader: loader.Loader = function(content): void {
	this.cacheable && this.cacheable(true);
	this.addDependency(this.resourcePath);

	var options = getOptions(this) || {};
	var filename = '[name].[ext]';

	if ('string' === typeof options.name) {
		filename = options.name;
	}

	var url = interpolateName(this, filename, {
		context: options.context || this.rootContext || this.context,
		content: content,
		regExp: options.regExp
	});

	var callback = this.async();
	const stream = fs.createReadStream(this.resourcePath);

	if (options.emitFile || this.emitFile) {
		this.emitFile(url, content, null);
	}

	probe(stream)
		.then(image => {
			if (callback) {
				callback(null, imageToString({ ...image, src: url }));
			} else {
				throw new Error('Cannot be async :/');
			}
		})
		.catch(error => {
			if (callback) {
				callback(error);
			} else {
				throw error;
			}
		})
		.finally(() => {
			stream.close();
		});
};

export default loader;
export const raw = true;
