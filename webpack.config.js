const path = require('path');
const webpack = require('webpack');
const PathRewriterPlugin = require('webpack-path-rewriter');

module.exports = {
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: 'file-loader'
			},
			{
				test: /\.(json)$/,
				loader: PathRewriterPlugin.rewriteAndEmit({
					name: '[hash].[ext]'
				})
			}
		]
	},
	resolve: {
		extensions: [ ".tsx", ".ts", ".js" ]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		contentBase: './dist'
	},
	devtool: 'inline-source-map',
	plugins: [
		new webpack.ProvidePlugin({
			PIXI: 'pixi.js'
		}),
		new PathRewriterPlugin()
	]
};