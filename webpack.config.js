const webpack = require('webpack');

module.exports = {
  entry: ['source-map-support/register', './src/main.ts'],
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support/register");',
      raw: true,
      entryOnly: false,
    }),
  ],
  devtool: 'source-map',
};
