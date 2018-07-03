const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

exports.init = () => (
  new Promise((resolve, reject) => {
    app.listen(config.PORT, () => {
      resolve(app);
    });

    app.on('error', (err) => {
      reject(err);
    });
  })
);

exports.app = app;
