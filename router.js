const _ = require('lodash');
const fs = require('fs');
const spawn = require('child_process').spawn;
const notif = require('./helpers/notification');

const targets = {
  parlanode: 'parlanode',
  // parlasite: 'parlasite',
  // parlassets: 'parlassets'
};

const env = process.env.NODE_ENV;

exports.init = (app) => {
  /**
   * Health check route
   */
  app.get('/', (req, res) => {
    // eslint-disable-next-line no-console
    console.log('health check route: ok');
    res.send('ok');
  });

  /**
   * Deploy route
   */
  app.post('/deploy/:project', (req, res) => {
    const payload = req.body;
    const branch = payload.ref && _.last(payload.ref.split('/'));

    // eslint-disable-next-line no-console
    console.log('env:', env, 'branch:', branch);

    const project = req.params.project;

    if (!targets[project]) {
      return res.status(404).send('wrong project');
    }

    let deployBranch;

    const ecosystemConfigPath = `./targets/${targets[project]}/ecosystem.config.js`;
    if (fs.existsSync(ecosystemConfigPath)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const ecosystem = require(ecosystemConfigPath);
      if (ecosystem.deploy && ecosystem.deploy[env] && ecosystem.deploy[env].ref) {
        deployBranch = _.last(ecosystem.deploy[env].ref.split('/'));
      }
    } else {
      deployBranch = env === 'production' ? 'master' : env;
    }

    if (!deployBranch || deployBranch !== branch) {
      return res.send('wrong branch');
    }

    return new Promise((resolve, reject) => {
      const fly = spawn('./node_modules/.bin/fly', [`deploy:${env}`, '--flightplan', `targets/${targets[project]}/flightplan.js`]);

      let msg = '';

      notif.sendNotification(project, `Started deploying *${project}* on *${env}*`);

      fly.stdout.on('data', (data) => {
        msg += data;
        // eslint-disable-next-line no-console
        console.log(data.toString());
      });

      fly.stderr.on('data', (data) => {
        notif.sendNotification(project, `Error on deploy: *${project}* on *${env}*`);
        reject(data);
      });

      fly.on('close', (code) => {
        // eslint-disable-next-line no-console
        console.log('exit code:', code);
        if (code === 0) {
          notif.sendNotification(project, `Finished deploy: *${project}* on *${env}*`);
          res.status(200).send(msg);
        } else {
          notif.sendNotification(project, msg);
          res.status(400).send(msg);
        }
        resolve();
      });
    })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error: ', err);
        res.status(400).send(err);
      });
  });

  app.post('/revert/:project/:commit', (req, res) => {
    const project = req.params.project;
    const commit = req.params.commit;

    if (!commit) {
      return res.status(400).send('Commit param missing. The url format is /revert/:project/:commit');
    }
    if (!targets[project]) {
      return res.status(404).send('Project does not exist. The url format is /revert/:project/:commit');
    }

    return new Promise((resolve, reject) => {
      const fly = spawn('./node_modules/.bin/fly', [`revert:${process.env.NODE_ENV}`, '--flightplan', `targets/${targets[project]}/flightplan.js`, `--commit=${commit}`]);

      let msg = '';

      notif.sendNotification(project, `Start revert of *${project}* on *${env}* to commit *${commit}*`);

      fly.stdout.on('data', (data) => {
        msg += data;
        // eslint-disable-next-line no-console
        console.log(data.toString());
      });

      fly.stderr.on('data', (data) => {
        notif.sendNotification(project, `Error on revert: *${project}* on *${env}* to commit *${commit}*`);
        reject(data);
      });

      fly.on('close', (code) => {
        // eslint-disable-next-line no-console
        console.log('exit code:', code);
        if (code === 0) {
          notif.sendNotification(project, `Finished revert: *${project}* on *${env}* to commit *${commit}*`);
          res.status(200).send(msg);
        } else {
          notif.sendNotification(project, msg);
          res.status(400).send(msg);
        }
        resolve();
      });
    })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Error: ', err);
        res.status(400).send(err);
      });
  });
};
