import AWS from 'aws-sdk';
import awsConfig from '../credentials/aws.js';
import mimetype from 'mime-types';
import fs from 'fs';

AWS.config.update(awsConfig);
let s3Bucket = new AWS.S3({params: {Bucket: 'keylemonservice'}});

// uploads an file to s3
function uploadToS3(id, blob, ContentType) {
    let data = {
        Key: id,
        Body: blob,
        ContentType
    };

    let promise = new Promise((resolve, reject) => {
        s3Bucket.putObject(data, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(id);
            }
        });
    });

    return promise;
}

async function uploadToS3FromFile(id, file) {
    let filePromise = new Promise((resolve, reject) => {
        fs.readFile(file, (err, fileData) => {
            if (err) {
                reject(err);
            }
            resolve(fileData);
        });
    });
    let buffer = await filePromise;

    let data = {
        Key: id,
        Body: buffer,
        ContentType: mimetype.lookup(file) || 'application/octet-stream'
    };

    let promise = new Promise((resolve, reject) => {
        s3Bucket.putObject(data, err => {
            if (err) {
                reject(err);
            } else {
                resolve(id);
            }
        });
    });

    return promise;
}

// Downloads a file with the given id from s3, and passes along all of its info and buffer
function downloadFromS3(id, path) {
    let params = {Key: `${path}${id}`};

    let promise = new Promise((resolve, reject) => {
        s3Bucket.getObject(params, (err, data) => {
            if (err) {
                reject(err);
            }

            let extension = mimetype.extension(data.ContentType) || '.bin';
            resolve({
                id,
                extension,
                blob: data.Body,
                fileName: `${id}.${extension}`,
                fullPath: `tmp/${path}${id}.${extension}`,
                contentType: data.ContentType
            });
        });
    });

    return promise;
}

async function downloadFromS3ToFile(id, path) {
    let file = await downloadFromS3(id, path);

    let promise = new Promise((resolve, reject) => {
        fs.writeFile(file.fullPath, file.blob, err => {
            if (err) {
                reject(err);
            }
            file.blob = null;

            resolve(file);
        });
    });

    return promise;
}

export default {
    uploadToS3,
    uploadToS3FromFile,
    downloadFromS3,
    downloadFromS3ToFile
};

