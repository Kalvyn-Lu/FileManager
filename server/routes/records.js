import express from 'express';
import response from './responseWrapper';
import {defaultParameters} from '../utils/requestUtils';
import recordController from '../controllers/recordController';
let router = express.Router();

async function getRecords(req, res) {
    let args = await defaultParameters(req, [], []);

    recordController
        .getRecords(args)
        .then(response.success(res))
        .catch(response.failure(res));
}
router.get('/', getRecords);

async function getRecord(req, res) {
    let args = await defaultParameters(req, [], []);

    recordController
        .getRecord(args)
        .then(response.success(res))
        .catch(response.failure(res));
}
router.get('/:id', getRecord);

async function updateRecord(req, res) {
    let args = await defaultParameters(req, [], []);

    recordController
        .updateRecord(args)
        .then(response.success(res))
        .catch(response.failure(res));
}
router.post('/:id', updateRecord);

async function deleteRecord(req, res) {
    let args = await defaultParameters(req, [], []);

    recordController
        .deleteRecord(args)
        .then(response.success(res))
        .catch(response.failure(res));
}
router.delete('/:id', deleteRecord);

export default (app) => {
    app.use('/api/Records', router);
};
