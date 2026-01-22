const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/renderer/index.tsx', // Entry point for React
  target: 'electron-renderer',       // Target Electron renderer process
  devtool: 'inline-source-map',
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,               // Match .ts and .tsx files
        use: 'ts-loader',             // Use ts-loader to compile
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolve these extensions
  },
  
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html', // Assuming you have an index.html template
    }),
  ],
};