var AssetsPlugin = require('assets-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var notifier = require('node-notifier');

function NotifyPlugin() {}
NotifyPlugin.prototype.apply = function(compiler) {
    compiler.plugin('done', function(stats) {
        var jsonStats = stats.toJson();
        var errorCount = jsonStats.errors.length;

        notifier.notify({
            title: 'File Manager - Watch',
            message: stats.hasErrors() ? errorCount + ' Build Error(s)' : 'Build Complete',
            sound: stats.hasErrors() ? 'Funk' : false
        });
    });
};

module.exports = {
    entry: {
        app: './src/js/app',
        vendor: [
            // Polyfills in vendor bundle so they're loaded early
            './src/js/polyfills',

            'react',
            'react/addons',
            'react-router'
        ]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].bundle.js',
        publicPath: '/'
    },
    resolve: {
        fallback: __dirname + '/node_modules',
        extensions: ['', '.js', '.jsx'],
        alias: {
            'babel': 'babel-core',
            'flux': __dirname + '/src/js/flux',
            'constants': __dirname + '/src/js/constants',
            'routes': __dirname + '/src/js/routes',
            'component': __dirname + '/src/js/componentWrapper/component.js'
        },
        packageMains: ["webpack", "browser", "web", "browserify", "main", ["jam", "main"]]
    },
    resolveLoader: {
        fallback: __dirname + '/node_modules'
    },
    watchOptions: {
        aggregateTimeout: 200
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            // Ignore bower/node packages
            exclude: /\/(bower_components|node_modules)\//,
            loader: 'babel?stage=0'
        }, {
            // Include js-csp
            test: /\/node_modules\/js-csp\/.*\.js$/,
            loader: 'babel?stage=0'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css', {publicPath: '../'})
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('css!sass?outputStyle=expanded')
        }, {
            test: /\/img\//,
            loader: 'file?context=src/img&name=img/[path][name].[ext]'
        }, {
            test: /\/fonts\//,
            loader: 'file?name=fonts/[name].[ext]'
        }]
    },
    plugins: [
        new AssetsPlugin({ filename: 'assets.json' }),
        new CommonsChunkPlugin('vendor', 'js/vendor.bundle.js'),
        new ExtractTextPlugin('css/[name].css'),
        new NotifyPlugin()
    ]
};
