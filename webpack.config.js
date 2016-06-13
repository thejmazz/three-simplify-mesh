module.exports = {
  entry: './index.js',
  output: {
    path: 'dist',
    filename: 'simplify.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel'
    }]
  }
}
