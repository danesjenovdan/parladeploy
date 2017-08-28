if ( process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development' ) throw Error('Missing NODE_ENV');

const config = process.env.NODE_ENV === 'production' ? require('./config.prod') : require('./config.dev');

module.exports = config;