const server = require('./server');
const router = require('./router');
const config = require('./config');

function init() {

  server.init()
    .then(router.init)
    .then(() => {

      console.log('Server running on port: ' + config.PORT);

    });

}


if ( require.main === module ) {
  init();
}

exports.app  = server.app;
exports.init = init;
