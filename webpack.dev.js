const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = [
  {
    name: 'client',
    entry: './src/index.ts',
    devtool: 'inline-source-map', //getting rid of this decreases the size by a lot
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: 'file-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist/')
    },
    watch: true
  }
];