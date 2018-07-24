const os = require('os');
const fetch = require('node-fetch');
const config = require('../config');

exports.sendNotification = (project, msg) => {
  if (config.OUTPUT_URL) {
    const body = {
      text: msg,
      attachments: [{
        fallback: `${project} - parladeploy on ${os.hostname()}`,
        footer: `${project} - parladeploy on ${os.hostname()}`,
      }],
    };

    if (config.OUTPUT_URL) {
      fetch(config.OUTPUT_URL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          // eslint-disable-next-line no-console
          console.log('Notification sent:', msg);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error when sending notification', err);
        });
    }
  }
};
