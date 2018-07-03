/* eslint-disable global-require */
const env = process.env.NODE_ENV;

if (env !== 'production' && env !== 'develop' && env !== 'staging') {
  throw Error('Missing NODE_ENV');
}

let config;

if (env === 'production') {
  config = require('./config.prod');
} else if (env === 'staging') {
  config = require('./config.staging');
} else {
  config = require('./config.dev');
}

module.exports = config;
