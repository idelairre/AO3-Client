var path = require('path');

'use strict';

module.exports = {
  basePath: '../',
  autoWatch: false,
  singleRun: true,
  colors: true,
  frameworks: ['mocha'],
  browsers: ['Chrome'],
  plugins: [
    'karma-htmlfile-reporter',
    'karma-mocha',
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-phantomjs-launcher',
    'karma-sourcemap-loader',
    'karma-webpack'
  ],
  files: [
    './test/compiled.spec.js'
  ],
  preprocessors: {
    './test/compiled.spec.js': ['webpack', 'sourcemap']
  },
  webpack: {
    devtool: 'eval',
    plugins: [],
    module: {
      preLoaders: [{
        test: /\.json$/,
        loader: 'json-loader'
      }],
      loaders: [{
        test: /\.js$/,
        loader: 'babel?cacheDirectory',
        exclude: /node_modules/
      }]
    },
    modulesDirectories: ['node_modules'],
    resolve: {
      root: path.resolve(__dirname),
      extensions: ['', '.webpack.js', '.web.js', '.js']
    },
    resolveLoader: {
      root: path.resolve('node_modules')
    },
    node: {
      fs: 'empty',
      path: 'empty',
      net: 'empty'
    }
  },
  webpackMiddleware: {
    stats: {
      chunks: false,
      errors: true,
      colors: true,
      modules: false,
      noInfo: true,
      warnings: false
    }
  },
  captureTimeout: 60000,
  browserDisconnectTimeout : 10000,
  browserDisconnectTolerance : 1,
  browserNoActivityTimeout : 60000
}
