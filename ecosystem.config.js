const config = require('./config');

const project = 'parladeploy';
const command = [
  // eslint-disable-next-line no-template-curly-in-string
  'npm install && MONGO_USERNAME=${MONGO_USERNAME} MONGO_PASSWORD=${MONGO_PASSWORD}',
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
  }],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production_hr: {
      user: 'parlauser',
      host: 'deploy.parlametar.hr',
      ref: 'origin/develop',
      repo: `https://github.com/danesjenovdan/${project}.git`,
      path: `${config.PROJECTS_DIR_PATH}/${project}`,
      'post-deploy': `${command} --env production --update-env`,
      env: {
        NODE_ENV: 'production',
        DEPLOY_BRANCH_PARLANODE: 'hr',
        DEPLOY_BRANCH_PARLASITE: 'hr',
        DEPLOY_BRANCH_PARLASSETS: 'hr',
      },
    },
    production_pl: {
      user: 'parlauser',
      host: 'deploy.pl.parlameter.si',
      ref: 'origin/develop',
      repo: `https://github.com/danesjenovdan/${project}.git`,
      path: `${config.PROJECTS_DIR_PATH}/${project}`,
      'post-deploy': `${command} --env production --update-env`,
      env: {
        NODE_ENV: 'production',
        DEPLOY_BRANCH_PARLANODE: 'pl',
        DEPLOY_BRANCH_PARLASITE: 'pl',
        DEPLOY_BRANCH_PARLASSETS: 'pl',
      },
    },
    production_english: {
      user: 'parlauser',
      host: 'deploy.english.parlameter.si',
      ref: 'origin/develop',
      repo: `https://github.com/danesjenovdan/${project}.git`,
      path: `${config.PROJECTS_DIR_PATH}/${project}`,
      'post-deploy': `${command} --env production --update-env`,
      env: {
        NODE_ENV: 'production',
        DEPLOY_BRANCH_PARLANODE: 'develop',
        DEPLOY_BRANCH_PARLASITE: 'develop',
        DEPLOY_BRANCH_PARLASSETS: 'sl',
      },
    },
    staging_sl: {
      user: 'parlauser',
      host: 'deploy.majkemi.parlameter.si',
      ref: 'origin/develop',
      repo: `https://github.com/danesjenovdan/${project}.git`,
      path: `${config.PROJECTS_DIR_PATH}/${project}`,
      'post-deploy': `${command} --env production --update-env`,
      env: {
        NODE_ENV: 'production',
        DEPLOY_BRANCH_PARLANODE: 'develop',
        DEPLOY_BRANCH_PARLASITE: 'develop',
        DEPLOY_BRANCH_PARLASSETS: 'sl',
      },
    },
  },
};
