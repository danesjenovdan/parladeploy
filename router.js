const config                   = require('./config');
const Promise                  = require('bluebird');
const notificationHelper       = require('./helpers/notification');
const request                  = require('request');
const { DEPLOY, REVERT, STOP } = require('./constants/target');

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
    console.log('Body: ', req.body);
    console.log('Headers: ', req.headers);

    return new Promise(( resolve, reject ) => {

      if ( DEPLOY.indexOf(project) < 0 ) return reject('Target does not exist');

      const spawn = require('child_process').spawn;

      console.log('Spawn: ', [`deploy:${process.env}`, `--flightplan`, `flightplan/${project}.js`]);

      const ls = spawn(`fly`, [`deploy:${process.env}`, `--flightplan`, `flightplan/${project}.js`]);

      let msg = '';

      ls.stdout.on('data', data => {
        msg += data;
        // if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, data.toString());
      });

      ls.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
      });

      ls.on('close', code => {

        if ( code === 0 ) {
          setTimeout(() => {
            // if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, 'DEPLOYMENT COMPLETE');
          }, 1000);
          res.status(200).send(msg);
        }
        else {
          // notificationHelper.sendNotification(project, msg, true);
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

  /**
   * Revert route
   * @param {Array} req.body.projects
   * @param {String} req.body.outputUrl
   * @param {String} req.body.token
   * @param {String} req.body.env
   */
  app.post('/revert', ( req, res ) => {

    const { projects, outputUrl, token, env = 'production' } = req.body;

    if ( !token || token !== '4EC48nHYVKqxSFdVfze4TgL9E33rrbjmGPCvkRec' ) {
      return res.status(400).send('Wrong token');
    }

    if ( env !== 'production' && env !== 'staging' ) {
      return res.status(400).send('Wrong enviroment');
    }

    return Promise.each(projects, ( project, i ) => {

        return new Promise(( resolve, reject ) => {

          if ( REVERT.indexOf(project) < 0 ) return reject('Target does not exist');

          const spawn = require('child_process').spawn;
          const ls    = spawn(`fly`, [`revert:${env}`, `--flightplan`, `flightplan/${project}.js`]);

          let msg = '';

          ls.stdout.on('data', data => {
            msg += data;
            if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, data.toString());
          });

          ls.stderr.on('data', data => {
            console.log(`stderr: ${data}`);
          });

          ls.on('close', code => {

            if ( code == 0 ) {
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

        });

      })
      .catch(( err ) => {

        console.log(err);
        res.status(400).send(err);

      });

  });

  /**
   * Stop route
   * @param {Array} req.body.projects
   * @param {String} req.body.outputUrl
   * @param {String} req.body.token
   * @param {String} req.body.env
   */
  app.post('/stop', ( req, res ) => {

    const { projects, outputUrl, token, env = 'production' } = req.body;

    if ( !token || token !== '4EC48nHYVKqxSFdVfze4TgL9E33rrbjmGPCvkRec' ) {
      return res.status(400).send('Wrong token');
    }

    if ( env !== 'production' && env !== 'staging' ) {
      return res.status(400).send('Wrong enviroment');
    }

    return Promise.each(projects, ( project, i ) => {

        return new Promise(( resolve, reject ) => {

          if ( !STOP_PATH[project] ) return reject('Target does not exist');

          const spawn = require('child_process').spawn;
          const ls    = spawn(`fly`, [`${env}:stop`, `--flightplan`, `flightplan/${project}.js`]);

          let msg = '';

          ls.stdout.on('data', data => {
            msg += data;
            if ( outputUrl ) notificationHelper.sendNotification(outputUrl, project, data.toString());
          });

          ls.stderr.on('data', data => {
            console.log(`stderr: ${data}`);
          });

          ls.on('close', code => {

            if ( code == 0 ) {
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

        });

      })
      .catch(( err ) => {

        console.log(err);
        res.status(400).send(err);

      });

  });

};