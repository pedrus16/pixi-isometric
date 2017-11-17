const path = require('path');
const webpack = require('webpack');
const PathRewriterPlugin = require('webpack-path-rewriter');

module.exports = {
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'awesome-typescript-loader',
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
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
		        ]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: 'file-loader'
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
	plugins: [
		new webpack.ProvidePlugin({
			PIXI: 'pixi.js'
		}),
		new PathRewriterPlugin()
	]
};