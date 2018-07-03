const server = require('./server');
const router = require('./router');
const config = require('./config');
const notif = require('./helpers/notification');

const env = process.env.NODE_ENV;
const project = 'parladeploy';

function init() {
  return Promise.resolve()
    .then(server.init)
    .then(router.init)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port: ${config.PORT}`);
      if (config.OUTPUT_URL) {
        // notif.sendNotification(config.OUTPUT_URL, project, `Started *${project}* on *${env}*`);
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Failed to start:', err);
      process.exit(1);
    });
}

if (require.main === module) {
  init();
}

exports.app = server.app;
exports.init = init;
