var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './app/main.js',
    output: { path: __dirname, filename: 'bundle.js' },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                "env": {
                    "development": {
                        "presets": ["react-hmre"]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
};