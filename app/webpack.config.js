//var webpack = require('webpack');

module.exports = {
	context: __dirname + '/js',

	entry: [
	  './app.js'
	],

	output: {
		filename: 'bundle.js',
		path: __dirname,
		publicPath: 'http://localhost:8090/assets'
	},

	module: {
		loaders: [
			{
				test: /\.js$/, 
				//exclude: /node_modules/, 
				loader: "babel", 
				query:
				  {
				    presets:['react']
				  }
			}
		]
	},

	resolve: {
		modulesDirectories: ['components','../../node_modules']
	}//,

	//devtool: 'cheap-source-map'
}