module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    {
      name           : 'parladeploy',
      script         : 'run.js',
      env_production : {
        NODE_ENV : 'production'
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
      user          : 'node',
      host          : '212.83.163.1',
      ref           : 'origin/master',
      repo          : 'git@github.com:repo.git',
      path          : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    staging    : {
      user          : 'parladaddy',
      host          : 'knedl.si',
      ref           : 'origin/master',
      repo          : 'git@parladeploy:danesjenovdan/parladeploy.git',
      path          : '/home/parladaddy/parladeploy',
      'post-deploy' : `npm install && MONGO_USERNAME=${process.env.MONGO_USERNAME} MONGO_PASSWORD=${process.env.MONGO_PASSWORD} pm2 reload ecosystem.config.js --env staging  --update-env --force`,
    },
    dev        : {
      user          : 'node',
      host          : '212.83.163.1',
      ref           : 'origin/master',
      repo          : 'git@github.com:repo.git',
      path          : '/var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
    }
  }
};
