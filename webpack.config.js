/* global __dirname, require, module*/

const webpack = require('webpack')
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const path = require('path')
const env = require('yargs').argv.env // use --env with webpack 2

var output = env.path !== undefined ? env.path : 'lib/'
var libraryName = 'mam.'
var entry
var target
var outputFile
var rules = [
  {
    test: /(\.jsx|\.js)$/,
    loader: 'babel-loader',
    exclude: [/(node_modules|bower_components)/]
  }
]

if (env === 'node') {
  entry = __dirname + '/src/node.js'
  outputFile = libraryName + 'node.js'
  target = 'node'
  rules.push({
    test: /\.rs$/,
    loader: 'rust-emscripten-loader',
    options: {
      release: true
    }
  })
} else {
  entry = __dirname + '/src/web.js'
  outputFile = libraryName + 'web.js'
  target = 'web'
  rules.push({
    test: /\.rs$/,
    loader: 'rust-wasm-loader',
    options: {
      release: true,
      path: output + '/'
    }
  })
}
console.log(output)
const config = {
  entry: entry,
  output: {
    path: __dirname + '/' + output,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: rules
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  target: target,
  node: {
    fs: 'empty',
    child_process: 'empty',
    path: 'empty'
  }
}
console.log(config.output)
module.exports = config
