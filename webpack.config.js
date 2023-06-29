const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: ['babel-polyfill', path.resolve(__dirname, 'src', 'main.js')],
  output: {
    path: path.resolve('dist'),
    filename: 'main-bundle.js',
  },
  resolve: {
    // Add ".ts" and ".tsx" as resolvable extensions.
    extensions: ['.js', '.tsx', '.ts', '.json', '.html'],
    modules: [
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
};
