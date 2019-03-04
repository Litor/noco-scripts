import gulp from 'gulp'
import path from 'path'
import named from 'vinyl-named'
import webpackGulp from 'webpack-stream'
import loaders from './webpack.loaders.js'
import plugins from './webpack.plugins.js'
import gulpConnect from 'gulp-connect'
import proxy from 'http-proxy-middleware'
import {nocoConfig, build, localize, cwd} from './getArgs'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'

var copy = require('lit-copy-resource')

var dist = cwd + (nocoConfig.dist || '/dist/')

var configWebpack = {
    context: cwd + '/src',
    entry: cwd + (nocoConfig.entry || '/src/main.js'),
    resolve: {
        modules: [
            path.resolve(__dirname + '/src'),
            path.resolve('./node_modules/'),
        ],
        extensions: ['.js', '.vue'],
        alias: {
            components: path.resolve(__dirname + '/src/components'),
            statics: path.resolve(__dirname + '/src/statics')
        }
    },

    mode: build ? 'production' : 'development',

    output: {
        publicPath: './',
        filename: 'app.js'
    },

    watch: (build || localize) ? false : true,

    module: {
        rules: loaders,
    },
    plugins: plugins,

    devtool: false,

    performance: {hints: false},
}

if (build) {
    configWebpack.optimization = {
        minimizer: [new UglifyJsPlugin()]
    }
}

gulp.task('connect', function (cb) {
    var proxyConfig = nocoConfig.proxy

    gulpConnect.server({
        host: '0.0.0.0',
        root: dist,
        port: nocoConfig.port || '8080',
        livereload: true,
        middleware: function (connect, opt) {
            let proxys = []

            if (proxy) {
                for (let i = 0; i < proxyConfig.length; i++) {
                    proxys.push(proxy(proxyConfig[i].source, {
                        target: proxyConfig[i].target,
                        changeOrigin: true,
                        secure: false,
                        headers: {
                            Connection: 'keep-alive'
                        }
                    }))
                }
            }

            return proxys
        }
    })
})

gulp.task('webpack', function (cb) {
    cb()
    return gulp
        .src([__dirname + '/emptyEntry.js'])
        .pipe(named())
        .pipe(webpackGulp(configWebpack, null, function () {
            if (localize) {
                setTimeout(function () {
                    copy(dist + '/app.js', dist + '/assets', './assets')
                    copy(dist + '/index.html', dist + '/assets', './assets')
                }, 10)
            }
        }))
        .pipe(gulp.dest(dist))
})

gulp.task('default', gulp.series(gulp.parallel(...(build || localize) ? ['webpack'] : ['webpack', 'connect'])))