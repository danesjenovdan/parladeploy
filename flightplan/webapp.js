const plan   = require('flightplan');
const config = require('../config');

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


plan.local(['deploy', 'default'], (local) => {

  /**
   * Clear temp
   */
  local.log('Clear and create temp folder');
  local.exec(`sudo rm -rf /home/centos/realstash/webapp-temp`);
  local.exec(`mkdir /home/centos/realstash/webapp-temp`);

});

plan.local(['deploy', 'default'], (local) => {

  /**
   * Create fresh clone
   */
  local.log('Clone master to temp folder');
  local.exec(`git clone git@realstash-webapp:realstash/realstash-webapp.git /home/centos/realstash/webapp-temp`);

});

plan.local(['deploy', 'default'], (local) => {

  /**
   * Install NPM dependencies
   */
  local.log('Install node dependencies');
  local.exec(`cd /home/centos/realstash/webapp-temp; npm install;`);

});

plan.local(['deploy', 'default'], (local) => {

  /**
   * Build webapp
   */
  local.log('Build webapp');
  local.exec(`cd /home/centos/realstash/webapp-temp; ng build;`);

});

plan.local(['deploy', 'default'], (local) => {

  /**
   * Build server
   */
  local.log('Build SSR server');
  local.exec(`cd /home/centos/realstash/webapp-temp; npm run build:server;`);

});

plan.local(['deploy', 'default'], (local) => {

  /**
   * Move original to rollback folder
   */
  local.log('Move original to rollback folder');
  local.exec(`mkdir -p /home/centos/realstash/webapp; mv /home/centos/realstash/webapp /home/centos/realstash/webapp-rollback;`);

});

plan.local(['deploy', 'default'], (local) => {

  /**
   * Move tmp folder to final folder and finish deployment
   */
  local.log('Finish deployment');
  local.exec(`mv /home/centos/realstash/webapp-temp /home/centos/realstash/webapp;`);

});

plan.local('revert', (local) => {

  /**
   * Rollback deployment to previous build
   */
  local.log('Rollback deployment');
  local.exec(`mv /home/centos/realstash/webapp-rollback /home/centos/realstash/webapp;`);

});