import express from 'express';
import info from './infos';
let router = express.Router();

export default (app) => {
    router.get('/', function(req, res) {
        res.send(JSON.stringify({status: 'success', contents: 'index'}));
    });
    app.use('/', router);

    info(app);
};
