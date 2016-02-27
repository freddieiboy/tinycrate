var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

	devtool: 'eval-source-map',

	entry: [
		'webpack-hot-middleware/client?reload=true',
		path.join(__dirname, 'app/index.js')
	],
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].js',
		publicPath: '/'
	},
	 plugins: [
		new webpack.HotModuleReplacementPlugin(),
	  new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
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
    	loader: ExtractTextPlugin.extract('style', 'css', 'sass')
    }]
	}
}
