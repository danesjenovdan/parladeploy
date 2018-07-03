const config = require('../../config');

const project = 'parlanode';
const command = [
  // eslint-disable-next-line no-template-curly-in-string
  'yarn && MONGO_USERNAME=${MONGO_USERNAME} MONGO_PASSWORD=${MONGO_PASSWORD} NODE_ICU_DATA=node_modules/full-icu',
  `pm2 startOrRestart ${config.DEPLOY_SCRIPT_PATH}/targets/${project}/ecosystem.config.js`,
].join(' ');

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [{
    name: project,
    script: 'run.js',
    env: {
      MONGO_USERNAME: process.env.MONGO_USERNAME,
      MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    },
    env_production: {
      NODE_ENV: 'production',
    },
    env_staging: {
      NODE_ENV: 'staging',
    },
  }],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'parlauser',
      host: 'localhost',
      ref: 'origin/develop', // TODO: change to production branch
      repo: `https://github.com/danesjenovdan/${project}.git`,
      path: `${config.PROJECTS_DIR_PATH}/${project}`,
      'post-deploy': `${command} --env production --update-env`,
      env: {
        NODE_ENV: 'production',
      },
    },
    staging: {
      user: 'parlauser',
      host: 'localhost',
      ref: 'origin/develop', // TODO: change to staging branch
      repo: `https://github.com/danesjenovdan/${project}.git`,
      path: `${config.PROJECTS_DIR_PATH}/${project}`,
      'post-deploy': `${command} --env staging --update-env`,
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};
