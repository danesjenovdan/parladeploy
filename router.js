const config             = require('./config');
const Promise            = require('bluebird');
const notificationHelper = require('./helpers/notification');
const request            = require('request');
const _                  = require('lodash');

const targets = {
  parlanode  : 'parlanode',
  parlasite  : 'parlasite',
  parlassets : 'parlassets'
};

const outputUrl = config.OUTPUT_URL;
const env       = process.env.NODE_ENV;

exports.init = ( app ) => {

  /**
   * Health check route
   */
  app.get('/', ( req, res ) => {

    console.log('OK');
    res.send('OK');

  });

  /**
   * Deploy route
   * @param {Array} req.body.projects
   * @param {String} req.body.outputUrl
   * @param {String} req.body.token
   * @param {String} req.body.env
   */
  app.post('/deploy/:project', ( req, res ) => {

    console.log(req.body);

    console.log('process.env.NODE_ENV: ',process.env.NODE_ENV);
    console.log('_.last(req.body.payload.ref.split(\'/\')): ',_.last(req.body.payload.ref.split('/')));

    // if NODE_ENV is not set to either 'staging' or 'master'
    if ( process.env.NODE_ENV !== 'master' && process.env.NODE_ENV !== 'staging' ) return res.send(200);
    // if NODE_ENV is staging but push was not to staging
    if ( process.env.NODE_ENV === 'staging' && _.last(req.body.payload.ref.split('/')) !== 'staging' ) return res.send(200);
    // if NODE_ENV is master but push was not to master
    if ( process.env.NODE_ENV === 'master' && _.last(req.body.payload.ref.split('/')) !== 'master' ) return res.send(200);

    const project = req.params.project;

    if ( !targets[project] ) return res.status(404).send('Project does not exist');

    return new Promise(( resolve, reject ) => {

      const spawn = require('child_process').spawn;
      const ls    = spawn(`fly`, [`deploy:${process.env.NODE_ENV}`, `--flightplan`, `targets/${targets[project]}/flightplan.js`]);

      let msg = '';

      if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, `Started deploying *${project}* on *${env}*`);

      ls.stdout.on('data', data => {
        msg += data;
        console.log(data.toString());
      });

      ls.stderr.on('data', data => {
        if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, `Error on deploy: *${project}* on *${env}*`);
        reject(data);
      });

      ls.on('close', code => {

        if ( code === 0 ) {
          if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, `Finished deploy: *${project}* on *${env}*`);
          res.status(200).send(msg);
        }
        else {
          notificationHelper.sendNotification(outputUrl, project, msg);
          res.status(400).send(msg);
        }

        resolve();

      });

    })
      .catch(( err ) => {

        console.log('Error: ', err);
        res.status(400).send(err);

      });

  });

  app.post('/revert/:project/:commit', ( req, res ) => {

    const project = req.params.project;
    const commit  = req.params.commit;

    if ( !commit ) return res.status(400).send('Commit param missing. The url format is /revert/:project/:commit');
    if ( !targets[project] ) return res.status(404).send('Project does not exist. The url format is /revert/:project/:commit');

    return new Promise(( resolve, reject ) => {

      const spawn = require('child_process').spawn;
      const ls    = spawn(`fly`, [`revert:${process.env.NODE_ENV}`, `--flightplan`, `targets/${targets[project]}/flightplan.js`, `--commit=${commit}`]);

      let msg = '';

      if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, `Start revert of *${project}* on *${env}* to commit *${commit}*`);

      ls.stdout.on('data', data => {
        msg += data;
        console.log(data.toString());
      });

      ls.stderr.on('data', data => {
        if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, `Error on revert: *${project}* on *${env}* to commit *${commit}*`);
        reject(data);
      });

      ls.on('close', code => {

        if ( code === 0 ) {
          if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, `Finished revert: *${project}* on *${env}* to commit *${commit}*`);
          res.status(200).send(msg);
        }
        else {
          notificationHelper.sendNotification(outputUrl, project, msg);
          res.status(400).send(msg);
        }

        resolve();

      });

    })
      .catch(( err ) => {

        console.log('Error: ', err);
        res.status(400).send(err);

      });

  });

};