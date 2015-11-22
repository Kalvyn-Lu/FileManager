import express from 'express';
import info from './infos';
import files from './files';
import path from 'path';

export default (app) => {
    info(app);
    files(app);
    app.use('/js', express.static('../client/dist/js'));
    app.use('/css', express.static('../client/dist/css'));
    app.use('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
    });
};
