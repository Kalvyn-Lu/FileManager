import express from 'express';
import info from './infos';
import path from 'path';
let router = express.Router();

export default (app) => {
    app.use('/js', express.static('../client/dist/js'));
    app.use('/css', express.static('../client/dist/css'));
    app.use('/api', router);
    app.use('/', function(req, res) {
        console.log('found path: ', path.join(__dirname, '../../client/dist', 'index.html'));
        res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
    });

    console.log('updating');

    // info(app);
};
