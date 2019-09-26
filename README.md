# Webpack image loader with additional size information

This loader uses probe-image-size. While there are already a few other webpack loaders out there
that will additionally fetch images sizes - some did not seem very active to me. some had problems
loading [guetzli-fied](https://github.com/google/guetzli) JPEGs, etc.

So with all the best [intentions](https://xkcd.com/927/) - here is yet another loader.


## Why?
There are certain use cases where it is beneficial to know the dimensions of the image you (or your page)
is about to show.
* an image album (e.g. a bit like masonry)
* using images without a page re-render when loading is done (usually a page 'jumps' when the actua image is shown - moving content further down the page as more images load. If you know their sizes you are able to reserve space in the layout and offer a slightly better UX)
* .. even more


## Similar Projects

* https://www.npmjs.com/package/probe-image-size-loader
* https://github.com/boopathi/image-size-loader
* https://github.com/tremby/image-dimensions-loader
* https://github.com/dashed/sizeof-loader

## Usage

[Documentation: Using loaders](https://webpack.js.org/concepts/#loaders)

### Installation
``` javascript
npm  install --save-dev loader-probe-image-size
```

### Configuration
Add the loader to your webpack configuration (or replace your existing image loader)
```javascript
// webpack.config.[ts|js]
// ...
  module: {
    loaders: [
      {
        test: /\.(gif|jpe?g|png|svg|webp|ico)$/,
		use: [{
		  loader: 'loader-probe-image-size',
		    options: {
			  context: path.resolve(__dirname, 'src')
		    }
		  }
		]
      }
    ]
  }
// ...
```
__Advanced usage__
The loader uses the interpolatename function from [loader-utils](https://github.com/webpack/loader-utils) - meaning you can
modify the filename of the emitted file via options: {name: ...} .

The following tokens are replaced in the `name` parameter:

* `[ext]` the extension of the resource
* `[name]` the basename of the resource
* `[path]` the path of the resource relative to the `context` query parameter or option.
* `[folder]` the folder the resource is in.
* `[emoji]` a random emoji representation of `options.content`
* `[emoji:<length>]` same as above, but with a customizable number of emojis
* `[contenthash]` the hash of `options.content` (Buffer) (by default it's the hex digest of the md5 hash)
* `[<hashType>:contenthash:<digestType>:<length>]` optionally one can configure
  * other `hashType`s, i. e. `sha1`, `md5`, `sha256`, `sha512`
  * other `digestType`s, i. e. `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
  * and `length` the length in chars
* `[hash]` the hash of `options.content` (Buffer) (by default it's the hex digest of the md5 hash)
* `[<hashType>:hash:<digestType>:<length>]` optionally one can configure
  * other `hashType`s, i. e. `sha1`, `md5`, `sha256`, `sha512`
  * other `digestType`s, i. e. `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
  * and `length` the length in chars
* `[N]` the N-th match obtained from matching the current file name against `options.regExp`

Shamelessly stolen from / source: https://github.com/webpack/loader-utils#interpolatename


### Usage

Import images from within your code
``` javascript
import image from './myimagefile.jpeg';

// => emits myimagefile.jpeg
// => image is an object {
//	src: string,
//	height: number
//	width: number
// 	type: [svg|webp|jpeg|png|...]
//  toString: () => string ...
// }
```

#### Usage with TypeScript
And for those fancy typescript users - you might want to add additional info to your image modules, e.g. /src/@types/images.d.ts,
so your IDE of choice will assist you a bit more.
``` javascript
declare module '*.jpg' {
	export const src: string;
	export const type: string;
	export const width: number;
	export const height: number;
}
```