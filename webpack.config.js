const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./index.js"]
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "build")
  },
  optimization: {
    splitChunks: { chunks: "all", maxSize: 1024 * 1024 * 0.2 },
  },
  devServer: {
    port: 7500
  },
  devtool: "eval",
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: true
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/service-worker.js'),
          to: path.resolve(__dirname, 'build')
        },
        {
          from: path.resolve(__dirname, 'static'),
          to: path.resolve(__dirname, 'build/static')
        },
        {
          from: path.resolve(__dirname, 'src/img'),
          to: path.resolve(__dirname, 'build/img')
        }
      ]
    }),
    new InjectManifest({
      swSrc: "./service-worker.js",
      swDest: "service-worker.js",
      exclude: [/static/]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env"
            ],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(png|jpg|svg|gif|ttf|woff|woff2)$/,
        use: ["file-loader"]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ]
  }
}