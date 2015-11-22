import express from 'express';
import info from './infos';
let router = express.Router();

export default (app) => {
    app.use('/', express.static('../client/dist'));
    app.use('/api', router);

    info(app);
};
