const fetch = require('node-fetch');

exports.sendNotification = ( url, project, msg ) => {

  const body = {
    text : msg
  };

  if ( url ) {
    fetch(url, {
      method  : 'POST',
      body    : JSON.stringify(body),
      headers : { 'Content-Type' : 'application/json' },
    })
      .then(() => {
        console.log('Notification sent');
      })
      .catch(( err ) => {
        console.log('Error when sending notification');
      });
  }

};