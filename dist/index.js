"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const loader_utils_1 = require("loader-utils");
const probe_image_size_1 = __importDefault(require("probe-image-size"));
const imageToString = function (image) {
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
const loader = function (content) {
    this.cacheable && this.cacheable(true);
    this.addDependency(this.resourcePath);
    var options = loader_utils_1.getOptions(this) || {};
    var filename = '[name].[ext]';
    if ('string' === typeof options.name) {
        filename = options.name;
    }
    var url = loader_utils_1.interpolateName(this, filename, {
        context: options.context || this.rootContext || this.context,
        content: content,
        regExp: options.regExp
    });
    var callback = this.async();
    const stream = fs_1.default.createReadStream(this.resourcePath);
    if (callback) {
        probe_image_size_1.default(stream)
            .then(image => {
            if (options.emitFile || this.emitFile) {
                this.emitFile(url, content, null);
            }
            // additional check to callback to keep typescript happy?
            callback && callback(null, imageToString(Object.assign(Object.assign({}, image), { src: url })));
        })
            .catch(error => {
            // additional check to callback to keep typescript happy?
            callback && callback(error);
        })
            .finally(() => {
            stream.close();
        });
    }
    else {
        throw new Error('Cannot be async :/');
    }
};
exports.default = loader;
exports.raw = true;
//# sourceMappingURL=index.js.map