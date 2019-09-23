import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (test_file: string, _options = {}): Promise<webpack.Stats> => {
	const compiler = webpack({
		context: __dirname,
		entry: `./${test_file}`,
		output: {
			path: path.resolve(__dirname),
			filename: 'bundle.js'
		},
		module: {
			rules: [
				{
					test: /\.(jpe?g|png|gif|webp|svg)$/,
					use: {
						loader: path.resolve(__dirname, './../src/index.ts'),
						options: {}
					}
				}
			]
		}
	});

	compiler.outputFileSystem = new memoryfs();

	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err) {
				reject(err);
			} else if (stats.hasErrors()) {
				reject(new Error(stats.toJson().errors.join(' ')));
			} else {
				resolve(stats);
			}
		});
	});
};
