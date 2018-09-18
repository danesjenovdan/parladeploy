const plan = require('flightplan');
const config = require('../../config');

const project = 'parlassets';
const branch = process.env[`DEPLOY_BRANCH_${project.toUpperCase()}`] || 'master';

// Configuration
plan.target('production', {
  host: 'localhost',
}, {
  env: 'production',
});

plan.target('staging', {
  host: 'localhost',
}, {
  env: 'staging',
});

// Deploy
plan.local(['deploy', 'default'], (local) => {
  const enviroment = plan.runtime.options.env;

  // Create folders
  local.log('Cloning repo');

  local.exec([
    `cd ${config.PROJECTS_DIR_PATH}/${project}`,
    'git fetch --depth=5 --all --tags',
    `git reset --hard origin/${branch}`,
  ].join('; '));

  local.log('Building styles');
  local.exec([
    `cd ${config.PROJECTS_DIR_PATH}/${project}`,
    `NODE_ENV=${enviroment} yarn && NODE_ENV=${enviroment} yarn sass`,
  ].join('; '));
});

// Revert Deployment
// MISSING!!!

// Stop app
// NOTHING TO STOP
