const express    = require('express');
const app        = express();
const config     = require('./config');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ extended : true }));

exports.init = () => {

  return new Promise(( resolve, reject ) => {

    app.listen(config.PORT, '0.0.0.0', () => {

      resolve(app);

    });

  });

};

exports.app = app;