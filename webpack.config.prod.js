var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry: [
		path.join(__dirname, 'app/tinycrate.js')
	],
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name]-[hash].min.js',
	},
   plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new ExtractTextPlugin('[name]-[hash].min.css', {
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loaders: ['babel']
			}, {
      test: /\.svg$/,
      loader: 'file-loader'
    }, {
    	test: /\.scss$/,
    	loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'sass-loader')
    }]
	}
}
