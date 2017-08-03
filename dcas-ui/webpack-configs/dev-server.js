module.exports = {
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  devServer: {
    compress: true,

    historyApiFallback: true,
    // publicPath: '/console/',
    // historyApiFallback: {
    //   disableDotRule: true,
    //   index: '/console/'
    // },
    // overlay: false,
    // staticOptions: {
    //   index: 'src/app/index.html', // @sorry when this breaks
    // },
    proxy: {
      '/api/**': {
        target: 'http://localhost:8000/dcas-bff-service',
        changeOrigin: true,
        pathRewrite: {'^/api' : ''}
      }
    }
  }
};
