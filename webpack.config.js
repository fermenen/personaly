const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');
const InjectHtmlPlugin = require('inject-html-webpack-plugin');
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');


module.exports = {
    mode: 'production',
    entry: {
        app: './personaly/static/index.js',
    },
    output: {
        filename: 'js/personaly.[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {

        rules: [
            {test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/,},
            {
                test: /\.scss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css", ".scss"]
    }
    ,
    devtool: 'inline-source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/personaly.[name].[hash].css",
            chunkFilename: "[id].css"
        }),
        new CleanWebpackPlugin(),
        new WorkboxPlugin.InjectManifest({
            swSrc: './personaly/static/js/sw.ts',
            swDest: '../personaly/templates/sw.js',
            maximumFileSizeToCacheInBytes: 6000000000,
            mode: 'production'
        }),
        new InjectHtmlPlugin({
            filename: './personaly/templates/app/base_app.html',
            transducer: "/dist/",
            chunks: ['app'],
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            validate: 'jquery-validation',
            UIkit: 'uikit'
        }),
    ],
};