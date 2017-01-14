var webpackConfig = require('./webpack.config.js')

module.exports = function (config) {
  config.set({
    browsers: [ 'PhantomJS' ],
    captureTimeout: 60000,
    browserNoActivityTimeout: 60000, // We need to accept that Webpack may take a while to build!
    singleRun: true,
    colors: true,
    frameworks: [ 'mocha', 'testdouble', 'chai' ], // Mocha is our testing framework of choice
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'universal/**/*.spec.js',
      'client/**/*.spec.js'
    ],
    preprocessors: {
      'universal/**/*.spec.js': [ 'webpack' ],
      'client/**/*.spec.js': [ 'webpack' ]
    },
    reporters: [ 'mocha' ],
    webpack: { // Simplified Webpack configuration
      module: {
        loaders: webpackConfig.module.loaders,
        noParse: [
        ]
      },
      node: {
        fs: 'empty'
      }
    },
    webpackServer: {
      noInfo: true // We don't want webpack output
    }
  })
}