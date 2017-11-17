const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	devServer: {
		contentBase: './dist'
	},
	devtool: 'inline-source-map'
});