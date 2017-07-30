const webpack = require('webpack');
const path = require('path');
const dateFormat = require('dateformat');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pkg = require('../package.json');

/**
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const isProduction = ENV === 'demo:build';

const DEMO_DIST = path.resolve(__dirname, 'dist');

const config = {
  entry: path.resolve(__dirname, isProduction ? 'main-aot.ts' : 'main.ts'),
  output: {
    path: DEMO_DIST,
    filename: isProduction ? 'index.[hash].js' : 'index.js',
    chunkFilename: isProduction ? 'chunk.[id].[hash].js' : 'chunk.[id].js'
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader?{configFileName: "demo/tsconfig.json"}',
          'angular2-template-loader',
          'angular-router-loader' + (isProduction ? '?aot=true&genDir=.' : ''),
        ]
      },
      { test: /\.html$/, loaders: ['raw-loader'] },
      { test: /\.md$/, loader: 'html-loader?minimize=false!markdown-loader' },
      { test: /\.css$/, loader: "style-loader!css-loader" },
    ]
  },
  stats: 'minimal', // Only output when errors or new compilation happen
  performance: {
    hints: false,
  },
  plugins: [
    new CleanWebpackPlugin([DEMO_DIST], {
      root: __dirname,
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      template: '!!pug-loader!' + path.resolve(__dirname, 'index.pug'),
      baseHref: isProduction ? '/ngx-card/' : '/',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        now: JSON.stringify(dateFormat(new Date(), 'dd mmm yyyy')),
        version: JSON.stringify(pkg.version),
        production: isProduction,
      },
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, '../node_modules/@salesforce-ux/design-system/assets/fonts'), to: 'assets/fonts' },
      { from: path.resolve(__dirname, '../node_modules/@salesforce-ux/design-system/assets/images'), to: 'assets/images' },
      { from: path.resolve(__dirname, '../node_modules/@salesforce-ux/design-system/assets/styles'), to: 'assets/styles' },
      {
        // SVG sprites
        context: path.resolve(__dirname, '../node_modules/@salesforce-ux/design-system/assets/icons'),
        from: '**/symbols.svg',
        to: 'assets/icons',
      },
      { from: path.resolve(__dirname, 'img'), to: 'img' },
      { from: path.resolve(__dirname, 'index.css') },
    ]),

    // Workaround needed for angular 2 angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, '../src') // location of your src
    ),

    new webpack.LoaderOptionsPlugin({
      debug: !isProduction,
      minimize: isProduction
    }),
  ],
};

if (!isProduction) {
  const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
  config.plugins.push(
    new BrowserSyncPlugin({
      host: '0.0.0.0',
      port: 1111,
      open: false,
      server: {
        baseDir: [DEMO_DIST]
      },
      reloadDelay: 100,
      reloadDebounce: 300,
    })
  );
}

if (isProduction) {
  config.plugins.push(
    // Only emit files when there are no errors
    new webpack.NoEmitOnErrorsPlugin(),

    // Minify all javascript, switch loaders to minimizing mode
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
    })
  );
}

module.exports = config;
