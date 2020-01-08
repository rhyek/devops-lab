import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'production',
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  entry: path.resolve(__dirname, './src/main.ts'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './build'),
  },
};

export default config;
