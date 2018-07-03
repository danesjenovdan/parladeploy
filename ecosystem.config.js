const config = require('./config');

const project = 'parladeploy';
const command = [
  // eslint-disable-next-line no-template-curly-in-string
  'yarn && MONGO_USERNAME=${MONGO_USERNAME} MONGO_PASSWORD=${MONGO_PASSWORD}',
  'pm2 reload ecosystem.config.js',
].join(' ');

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [{
    name: 'parladeploy',
    script: 'run.js',
    env: {
      MONGO_USERNAME: process.env.MONGO_USERNAME || '',
      MONGO_PASSWORD: process.env.MONGO_PASSWORD || '',
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
      host: 'deploy.hr.parlameter.si',
      ref: 'origin/hr',
      repo: `https://github.com/danesjenovdan/${project}.git`,
      path: `${config.PROJECTS_DIR_PATH}/${project}`,
      'post-deploy': `${command} --env production --update-env`,
    },
    staging: {
      user: 'parlauser',
      host: 'localhost',
      ref: 'origin/hr',
      repo: `https://github.com/danesjenovdan/${project}.git`,
      path: `${config.PROJECTS_DIR_PATH}/${project}`,
      'post-deploy': `${command} --env staging --update-env`,
    },
  },
};
