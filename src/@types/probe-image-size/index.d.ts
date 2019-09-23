declare module 'probe-image-size' {
	import { ReadStream } from 'fs';

	/**
	 * @param src String - URL to fetch
	 * @param options See 'got' documentation. Defaults changed to { retries: 1, timeout: 30000 }
	 * @param callback If callback (legacy node style) provided, Promise will not be returned
	 */
	function probe(
		src: string,
		options: ImageProbe.HTTPOptions,
		callback: (error: ImageProbe.Error, result: ImageProbe.HTTPResult) => void
	): void;

	/**
	 * @param src String - URL to fetch
	 * @param options See 'got' documentation. Defaults changed to { retries: 1, timeout: 30000 }
	 * @returns Promise with result
	 */
	function probe(src: string, options?: ImageProbe.HTTPOptions): Promise<ImageProbe.HTTPResult>;

	/**
	 * @param src Stream - readable stream. It's your responsibility to close that stream in promise
	 * @returns Promise with result
	 */
	function probe(src: ReadStream): Promise<ImageProbe.Result>;

	namespace ImageProbe {
		type ImageUnits = 'px' | 'in' | 'mm' | 'cm ' | 'pt' | 'pc' | 'em' | 'ex';

		export interface Result {
			width: number;
			height: number;
			type: string; // image 'type' (usual file name extention)
			mime: string; // mime type
			wUnits: ImageUnits; // width units type ('px' by default, can be different for SVG)
			hUnits: ImageUnits; // height units type ('px' by default, can be different for SVG)
		}

		interface HTTPResult extends Result {
			url: string;
			length?: number;
		}

		interface HTTPOptions {
			retries?: number;
			timeout?: number;
		}

		interface Error {
			name: string;
			message: string;
			code?: string;
			statusCode?: string;
		}
	}

	export = probe;
}
