const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');
const InjectHtmlPlugin = require('inject-html-webpack-plugin');
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

const config = {
    entry: {
        app: './personaly/dashboard/js/app.js',
        web: './personaly/web/js/web.js',
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
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css", ".scss"]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/personaly.[name].[hash].css",
            chunkFilename: "[id].css"
        }),
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new CleanWebpackPlugin(),
        new WorkboxPlugin.InjectManifest({
            swSrc: './personaly/personaly/sw.ts',
            swDest: '../personaly/templates/sw.js',
            maximumFileSizeToCacheInBytes: 6000000000,
            mode: 'production'
        }),
        new InjectHtmlPlugin({
            filename: './personaly/templates/app/base_app.html',
            transducer: "/dist/",
            chunks: ['app', 'vendors'],
        }),
        new InjectHtmlPlugin({
            filename: './personaly/templates/web/base_web.html',
            transducer: "/dist/",
            chunks: ['web', 'vendors'],
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            validate: 'jquery-validation',
            UIkit: 'uikit'
        }),

    ],

}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }
    if (argv.mode === 'production') {
        config.devtool = 'false';
    }
    return config;
};

