import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { host, port, secret } from './config.mjs';

import uir from './controllers/users-in-roles.mjs';
import users from './controllers/users.mjs';
import apps from './controllers/apps.mjs';
import apply from './controllers/apply.mjs';

const app = express();

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(cookieParser(secret));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('*', (req, res, next) => {
  res.success = data => res.json({
    ret: 0,
    data,
  });
  res.fail = (msg, err) => {
    res.json({
      ret: -1,
      msg,
      err,
    });
  };
  next();
});
app.use('/users', users);
app.use('/apps', apps);
app.use('/apply', apply);

app.use('/', uir);

app.listen(port, () => {
  console.log(`The server is running at http://${host}`);
});
