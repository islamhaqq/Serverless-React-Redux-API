/**
 * Configure webpack to transpile and bundle our app. Exclude all node
 * dependencies since aws-sdk cannot be bundled and isn't compatible with
 * Webpack.
 */

const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

/**
 * Webpack bundling configuration.
 * @type {Object}
 */
module.exports = {
  // make app entry point to the automatically generated Serverless file that
  // contains all AWS handlers
  entry: slsw.lib.entries,
  target: "node",
  // exclude all node dependencies since "aws-sdk" is incompatible with Webpack
  externals: [nodeExternals()],
  // transpile ES6+ using Babel for all .js files except in node_modules
  module: {
    rules: [
      {
        // transpile all .js files
        test: /\.js$/,
        // use babel for transpilation
        loader: "babel-loader",
        // check the root directory (all files)
        include: "__dirname",
        // ignore node_modules since these are just dependencies
        exclude: "/node_modules/"
      }
    ]
  }
}
