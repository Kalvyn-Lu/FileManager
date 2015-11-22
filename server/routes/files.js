import express from 'express';
import response from './responseWrapper';
import {defaultParameters} from '../utils/requestUtils';
import fileController from '../controllers/fileController';
let router = express.Router();

async function getFiles(req, res) {
    let args = await defaultParameters(req, [], []);

    fileController
        .getFiles(args)
        .then(response.success(res))
        .catch(response.failure(res));
}
router.get('/', getFiles);

async function getFile(req, res) {
    let args = await defaultParameters(req, [], []);

    fileController
        .getFile(args)
        .then(response.success(res))
        .catch(response.failure(res));
}
router.get('/:id', getFile);

async function updateFile(req, res) {
    let args = await defaultParameters(req, [], []);

    fileController
        .updateFile(args)
        .then(response.success(res))
        .catch(response.failure(res));
}
router.post('/:id', updateFile);

async function deleteFile(req, res) {
    let args = await defaultParameters(req, [], []);

    fileController
        .deleteFile(args)
        .then(response.success(res))
        .catch(response.failure(res));
}
router.delete('/:id', deleteFile);

export default (app) => {
    app.use('/api/files', router);
};
