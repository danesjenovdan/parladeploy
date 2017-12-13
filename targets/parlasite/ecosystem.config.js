const config = require('../../config');

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name           : 'parlasite',
      script         : 'run.js',
      env            : {
        COMMON_VARIABLE : 'true',
      },
      env_production : {
        NODE_ENV : 'production'
      },
      env_staging    : {
        NODE_ENV       : 'staging',
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
      repo          : 'git@parlasite:danesjenovdan/parlasite.git',
      path          : `${config.PROJECTS_DIR_PATH}/parlasite`,
      'post-deploy' : `yarn && pm2 startOrRestart ${config.DEPLOY_SCRIPT_PATH}/targets/parlanode/ecosystem.config.js --env production --update-env`,
      env           : {
        NODE_ENV : 'production'
      }
    },
    staging    : {
      user          : 'parladaddy',
      host          : 'localhost',
      ref           : 'origin/staging',
      repo          : 'git@parlasite:danesjenovdan/parlasite.git',
      path          : `${config.PROJECTS_DIR_PATH}/parlasite`,
      'post-deploy' : `yarn && pm2 startOrRestart ${config.DEPLOY_SCRIPT_PATH}/targets/parlasite/ecosystem.config.js --env staging --update-env`,
      env           : {
        NODE_ENV       : 'staging',
      }
    }
  }
};
