import express from 'express';
let router = express.Router();

import auth from './auth';
import response from './responseWrapper';

router.get('/ping', (req, res) => {
    response.success(res)({msg: 'pong'});
});

router.get('/authPing', auth((req, res) => {
    response.success(res)({msg: 'auth pong'});
}));

export default (app) => {
    app.use('/api/info', router);
};
