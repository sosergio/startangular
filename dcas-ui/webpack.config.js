const devServer = require('./webpack-configs/dev-server');
const ejectedDev = require('./webpack-configs/ejected.dev');

module.exports = Object.assign({}, ejectedDev, devServer);
