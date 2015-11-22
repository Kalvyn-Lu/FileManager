import express from 'express';
import path from 'path';
import ejs from 'ejs';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import polyfills from './polyfills'; //eslint-disable-line no-unused-vars
import routes from './routes/index';
import http from 'http';

let app = express();
let server = http.createServer(app);

// app.engine('html', ejs.renderFile);
// app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

server.listen(12000);

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
