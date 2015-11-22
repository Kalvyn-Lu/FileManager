import express from 'express';
import response from './responseWrapper';
let router = express.Router();

router.get('/ping', (req, res) => {
    response.success(res)({msg: 'pong'});
});

export default (app) => {
    app.use('/api/info', router);
};
