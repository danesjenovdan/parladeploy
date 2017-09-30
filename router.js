const config             = require('./config');
const Promise            = require('bluebird');
const notificationHelper = require('./helpers/notification');
const request            = require('request');

const targets = {
  parlanode : 'parlanode',
  parlasite : 'parlasite'
};

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

    const project   = req.params.project;
    const outputUrl = config.OUTPUT_URL;

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
          setTimeout(() => {
            if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, `Finish deploy: *${project}* on *${env}*`);
          }, 1000);
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