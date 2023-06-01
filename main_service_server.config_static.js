const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    target: "node",
    mode: "production",
    entry: [ "babel-polyfill", path.resolve(__dirname, '', 'main.js')],
    output: {
        path: path.resolve(__dirname, '' ),
        filename: 'mainServiceServer.js',
    },
    resolve: {
      // Add ".ts" and ".tsx" as resolvable extensions.
      extensions: [".js", ".tsx", ".ts", ".json", ".html"],
      modules: [
          path.resolve('.'),
          path.resolve('node_modules')
      ]
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              //exclude: /node_modules/,
              use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ["@babel/preset-env"]
                  },
              },
          },
          { test: /\.node$/,
            use: 'node-loader' 
          },
          {
            test: /\.html$/i,
            use: ["html-loader"],
          },
      ]
  }
};