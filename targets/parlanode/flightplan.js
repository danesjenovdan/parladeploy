const plan   = require('flightplan');
const config = require('../../config');

/**
 * Configuration
 */
plan.target('production', {
  host : 'localhost'
}, {
  env: 'production'
});

plan.target('staging', {
  host : 'localhost'
}, {
  env: 'staging'
});

/**
 * Deploy
 */
plan.local(['deploy', 'default'], ( local ) => {

  const enviroment = plan.runtime.options.env;

  /**
   * Create folders
   */
  local.log('Cloning repo');
  local.exec(`pm2 deploy ${__dirname}/ecosystem.config.js ${enviroment} --force`)

});

/**
 * Revert Deployment
 */
plan.local('revert', ( local ) => {

  const enviroment = plan.runtime.options.env;

  /**
   * Revert
   */
  local.log('Cloning repo');
  local.exec(`pm2 deploy ${__dirname}/ecosystem.config.js ${enviroment} revert prev`);

});

/**
 * Stop app
 */
plan.local('stop', ( local ) => {

  const enviroment = plan.runtime.options.env;

  /**
   * Stop with pm2
   */
  local.log('Stopping app');
  local.exec(`pm2 stop ${__dirname}/ecosystem.config.js ${enviroment}`);

});