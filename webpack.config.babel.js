import path from 'path'
import chalk from 'chalk'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'

const port = 8080
const isDev = process.env.NODE_ENV === 'development'
const FILENAME = '[name].js'
const PATH_PUBLIC = '/dist/'
const PATH_BUILD = path.resolve(__dirname, 'dist')

const webpackConfig = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: PATH_BUILD,
        filename: FILENAME
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    plugins: [
                        'transform-object-assign',
                        'transform-object-rest-spread',
                        'transform-decorators-legacy'
                    ],
                    presets: ['es2015', 'stage-2']
                }
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /.less$/,
                loader: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'font/[hash:5].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(PATH_BUILD, 'index.html'),
            template: path.resolve(__dirname, 'template/index.ejs'),
            chunks: ['index'],
            minify: {
                removeScriptTypeAttributes: true,
                removeStyleTypeAttributes: true,
            }
        }),
        // new HtmlWebpackHarddiskPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ],
}

if (isDev) {
    webpackConfig.devtool = 'source-map'
    webpackConfig.devServer = {
        publicPath: PATH_PUBLIC,
        filename: FILENAME,
        port
    }
    console.log(chalk.cyan(`请访问 http://localhost:${port}/dist/`))
} else {
    webpackConfig.plugins.push(
        ...[
            new CleanWebpackPlugin([PATH_BUILD], {
                root: __dirname,
                verbose: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: false,
                extractComments: {
                    banner: false
                }
            })
        ]
    )
}

export default webpackConfig
