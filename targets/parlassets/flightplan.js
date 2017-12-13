const plan   = require('flightplan');
const config = require('../../config');

/**
 * Configuration
 */
plan.target('production', {
  host : 'localhost'
}, {
  env : 'production'
});

plan.target('staging', {
  host : 'localhost'
}, {
  env : 'staging'
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
  local.exec(`cd /home/parladaddy/parlacdn/v1/parlassets; git pull;`)

  local.log('Build for production');
  local.exec('cd /home/parladaddy/parlacdn/v1/parlassets; yarn build;');

});

/**
 * Revert Deployment
 */
// MISSING!!!

/**
 * Stop app
 */
// NOTHING TO STOP