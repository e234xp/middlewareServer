const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: ['babel-polyfill', path.resolve(__dirname, '', 'main.js')],
  output: {
    path: path.resolve(''),
    filename: 'main-bundle.js',
  },
  resolve: {
    // Add ".ts" and ".tsx" as resolvable extensions.
    extensions: ['.js', '.tsx', '.ts', '.json', '.html'],
    modules: [
      path.resolve(__dirname, '.'),
      'node_modules',
      path.resolve('node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.html$/i,
        use: ['html-loader'],
      },
    ],
  },
  node: {
    __dirname: false,
  },
};
