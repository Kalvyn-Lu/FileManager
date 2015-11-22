import express from 'express';
import info from './infos';
import path from 'path';
let router = express.Router();

export default (app) => {
    info(app);
    app.use('/js', express.static('../client/dist/js'));
    app.use('/css', express.static('../client/dist/css'));
    app.use('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
    });
};
