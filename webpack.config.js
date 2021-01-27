const path = require('path');
const webpack = require("webpack");


// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './personaly/static/js/index.js',
    output: {
        filename: 'personaly-app.js',
        path: path.resolve(__dirname, 'personaly/static/js/dist'),
    },
    devtool: 'inline-source-map',
    mode: "development",
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({
                DEBUG: undefined,
            }),
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            validate: 'jquery-validation',
            UIkit: 'uikit'
        })
],
module: {
    rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
        }
    ],
}
}
;
