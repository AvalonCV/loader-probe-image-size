import webkit_compiler from './compiler';
import requireFromString from 'require-from-string';

interface ImageData {
	src: string;
	width: number;
	height: number;
	bytes?: number;
	type: string;
	[other: string]: any;
}

export const getWebpackImageObject = async (filename: string): Promise<null | ImageData> => {
	return new Promise(async resolve => {
		const stats = await webkit_compiler(filename);
		const modules = stats.toJson().modules;

		let output = modules && modules[0] ? modules[0].source : null;
		if (output) {
			resolve(requireFromString(output.replace('__webpack_public_path__', `''`)) as ImageData);
		} else {
			resolve(null);
		}
	});
};

interface TestImage {
	additional_description?: string;
	expected: {
		src: string;
		width: number;
		height: number;
		type: string;
	};
}

export const test_images: TestImage[] = [
	{
		additional_description: 'compressed by guetzli',
		expected: {
			src: 'Bristol-WML-2.84.jpg',
			width: 1442,
			height: 518,
			type: 'jpg'
		}
	},
	{
		expected: {
			src: 'PNG_transparency_demonstration_2.png',
			width: 800,
			height: 600,
			type: 'png'
		}
	},
	{
		expected: {
			src: 'test3.webp',
			width: 1280,
			height: 720,
			type: 'webp'
		}
	},
	{
		expected: {
			src: 'Rotating_earth_(large).gif',
			width: 400,
			height: 400,
			type: 'gif'
		}
	},
	{
		expected: {
			src: 'SVG_logo.svg',
			width: 100,
			height: 100,
			type: 'svg'
		}
	}
];

describe('A nice webpack loader for image sizes', () => {
	test_images.forEach(element => {
		test(`should load ${element.expected.type} files ${element.additional_description || ''}`, async () => {
			const image = await getWebpackImageObject('./images/' + element.expected.src);
			expect(image).toMatchObject(element.expected);
		});
	});
});
