import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import _ from './db/init'; //eslint-disable-line no-unused-vars
import polyfills from './polyfills'; //eslint-disable-line no-unused-vars
import routes from './routes/index';

import forceSSL from 'express-force-ssl';
import fs from 'fs';
import http from 'http';
import https from 'https';

let sslOptions = {
    key: fs.readFileSync('./credentials/site.key'),
    cert: fs.readFileSync('./credentials/site.cert')
};

let app = express();
let server = http.createServer(app);
let secureServer = https.createServer(sslOptions, app);

app.use(forceSSL);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //eslint-disable-line no-undef

secureServer.listen(443);
server.listen(80);

routes(app);

/// catch 404 and forwarding to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
