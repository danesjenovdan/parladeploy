const config             = require('./config');
const Promise            = require('bluebird');
const notificationHelper = require('./helpers/notification');
const request            = require('request');

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

    const project = req.params.project;

    return new Promise(( resolve, reject ) => {

      const spawn = require('child_process').spawn;
      const ls    = spawn(`fly`, [`deploy:${process.env.NODE_ENV}`, `--flightplan`, `flightplan/${project}.js`]);

      let msg = '';

      ls.stdout.on('data', data => {
        msg += data;
        console.log(data.toString());
        if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, data.toString());
      });

      ls.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
      });

      ls.on('close', code => {

        if ( code === 0 ) {
          setTimeout(() => {
            if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, 'DEPLOYMENT COMPLETE');
          }, 1000);
          res.status(200).send(msg);
        }
        else {
          notificationHelper.sendNotification(project, msg, true);
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