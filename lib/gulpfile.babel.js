'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _vinylNamed = require('vinyl-named');

var _vinylNamed2 = _interopRequireDefault(_vinylNamed);

var _webpackStream = require('webpack-stream');

var _webpackStream2 = _interopRequireDefault(_webpackStream);

var _webpackLoaders = require('./webpack.loaders.js');

var _webpackLoaders2 = _interopRequireDefault(_webpackLoaders);

var _webpackPlugins = require('./webpack.plugins.js');

var _webpackPlugins2 = _interopRequireDefault(_webpackPlugins);

var _gulpConnect = require('gulp-connect');

var _gulpConnect2 = _interopRequireDefault(_gulpConnect);

var _httpProxyMiddleware = require('http-proxy-middleware');

var _httpProxyMiddleware2 = _interopRequireDefault(_httpProxyMiddleware);

var _getArgs = require('./getArgs');

var _uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

var _uglifyjsWebpackPlugin2 = _interopRequireDefault(_uglifyjsWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var copy = require('lit-copy-resource');

var dist = _getArgs.cwd + (_getArgs.nocoConfig.dist || '/dist/');

var configWebpack = {
    context: _getArgs.cwd + '/src',
    entry: _getArgs.cwd + (_getArgs.nocoConfig.entry || '/src/main.js'),
    resolve: {
        modules: [_path2.default.resolve(__dirname + '/src'), _path2.default.resolve('./node_modules/')],
        extensions: ['.js', '.vue'],
        alias: {
            components: _getArgs.cwd + '/src/components',
            statics: _getArgs.cwd + '/src/statics'
        }
    },

    mode: _getArgs.build ? 'production' : 'development',

    output: {
        publicPath: './',
        filename: 'app.js'
    },

    watch: _getArgs.build || _getArgs.localize ? false : true,

    module: {
        rules: _webpackLoaders2.default
    },
    plugins: _webpackPlugins2.default,

    devtool: false,

    performance: { hints: false }
};

if (_getArgs.build) {
    configWebpack.optimization = {
        minimizer: [new _uglifyjsWebpackPlugin2.default()]
    };
}

_gulp2.default.task('connect', function (cb) {
    var proxyConfig = _getArgs.nocoConfig.proxy;

    _gulpConnect2.default.server({
        host: '0.0.0.0',
        root: dist,
        port: _getArgs.nocoConfig.port || '8080',
        livereload: true,
        middleware: function middleware(connect, opt) {
            var proxys = [];

            if (_httpProxyMiddleware2.default) {
                for (var i = 0; i < proxyConfig.length; i++) {
                    proxys.push((0, _httpProxyMiddleware2.default)(proxyConfig[i].source, {
                        target: proxyConfig[i].target,
                        changeOrigin: true,
                        secure: false,
                        headers: {
                            Connection: 'keep-alive'
                        }
                    }));
                }
            }

            return proxys;
        }
    });
});

_gulp2.default.task('webpack', function (cb) {
    cb();
    return _gulp2.default.src([__dirname + '/emptyEntry.js']).pipe((0, _vinylNamed2.default)()).pipe(!_getArgs.localize ? (0, _webpackStream2.default)(configWebpack) : (0, _webpackStream2.default)(configWebpack, null, function () {
        setTimeout(function () {
            copy(dist + '/app.js', dist + '/assets', './assets');
            copy(dist + '/index.html', dist + '/assets', './assets');
        }, 10);
    })).pipe(_gulp2.default.dest(dist));
});

_gulp2.default.task('default', _gulp2.default.series(_gulp2.default.parallel.apply(_gulp2.default, _toConsumableArray(_getArgs.build || _getArgs.localize ? ['webpack'] : ['webpack', 'connect']))));