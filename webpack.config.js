const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    devtool: 'cheap-source-map',
    plugins: [
        new HtmlWebpackPlugin
    ]
};
