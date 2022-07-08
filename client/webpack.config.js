const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const path = require('path')
const devMode = process.argv[process.argv.indexOf('--mode') + 1] !== 'production'

const webpackConfig = {
  devtool: 'inline-source-map',
  mode: devMode ? 'development' : 'production',
  entry: {
    index: './src/index.tsx'
  },
  output: {
    clean: true,
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
          test: /\.(j|t)sx?$/,
          use: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[ext]'
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[ext]'
        }
      },
    ],
  },
  plugins: [
      new webpack.ProgressPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HTMLWebpackPlugin({
        template: './index.html',
        favicon: './src/assets/images/favicon.ico'
      }),
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash].css'
      })
    ],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
  
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
};

if (devMode) {
  webpackConfig.devServer = {
    static: './build',
    historyApiFallback: true,
    hot: true,
    proxy: {
      '/graphql': 'http://localhost:4000'
    },
    client: {
      reconnect: true
    },
  }
}

module.exports = webpackConfig