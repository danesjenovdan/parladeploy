if ( process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'develop' && process.env.NODE_ENV !== 'staging' ) throw Error('Missing NODE_ENV');

let config;

if(process.env.NODE_ENV === 'production'){
  config = require('./config.prod');
}else if(process.env.NODE_ENV === 'staging'){
  config = require('./config.staging');
}else{
  config = require('./config.dev');
}

module.exports = config;