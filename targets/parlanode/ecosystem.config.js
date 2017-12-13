const config = require('../../config');

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name           : 'parlanode',
      script         : 'run.js',
      env            : {
        COMMON_VARIABLE : 'true',
      },
      env_production : {
        NODE_ENV : 'production',
        MONGO_USERNAME : process.env.MONGO_USERNAME,
        MONGO_PASSWORD : process.env.MONGO_PASSWORD,
      },
      env_staging    : {
        NODE_ENV       : 'staging',
        MONGO_USERNAME : process.env.MONGO_USERNAME,
        MONGO_PASSWORD : process.env.MONGO_PASSWORD,
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user          : 'parladaddy',
      host          : 'localhost',
      ref           : 'origin/master',
      repo          : 'git@parlanode:danesjenovdan/parlanode.git',
      path          : `${config.PROJECTS_DIR_PATH}/parlanode`,
      'post-deploy' : `yarn && MONGO_USERNAME=\${MONGO_USERNAME} MONGO_PASSWORD=\${MONGO_PASSWORD} pm2 startOrRestart ${config.DEPLOY_SCRIPT_PATH}/targets/parlanode/ecosystem.config.js --env production --update-env`,
      env           : {
        NODE_ENV : 'production'
      }
    },
    staging    : {
      user          : 'parladaddy',
      host          : 'localhost',
      ref           : 'origin/staging',
      repo          : 'git@parlanode:danesjenovdan/parlanode.git',
      path          : `${config.PROJECTS_DIR_PATH}/parlanode`,
      'post-deploy' : `yarn && MONGO_USERNAME=\${MONGO_USERNAME} MONGO_PASSWORD=\${MONGO_PASSWORD} pm2 startOrRestart ${config.DEPLOY_SCRIPT_PATH}/targets/parlanode/ecosystem.config.js --env staging --update-env`,
      env           : {
        NODE_ENV       : 'staging',
      }
    }
  }
};
