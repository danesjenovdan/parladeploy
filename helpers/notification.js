const fetch = require('node-fetch');

exports.sendNotification = (url, project, msg) => {
  const body = {
    text: msg,
    attachments: [{
      fallback: `${project} - parladeploy hr`,
      color: '#f44',
      footer: `${project} - parladeploy hr`,
    }],
  };

  if (url) {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Notification sent');
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error when sending notification', err);
      });
  }
};
