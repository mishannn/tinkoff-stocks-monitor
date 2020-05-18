const path = require('path');
const baseConfig = require('../../webpack.config');

const filename = 'tinkoff-stocks-monitor.js';

module.exports = {
  ...baseConfig,
  entry: './src/Monitor.ts',
  externals: {
    axios: {
      commonjs: 'axios',
      commonjs2: 'axios',
      amd: 'axios',
      root: 'axios',
    },
  },
  output: {
    filename,
    sourceMapFilename: filename + '.map',
    path: path.resolve(__dirname, 'dist'),
    globalObject: "typeof self !== 'undefined' ? self : this",
    libraryTarget: 'umd',
    // libraryExport: 'Monitor',
    library: 'TinkoffStocksMonitor',
  },
};
