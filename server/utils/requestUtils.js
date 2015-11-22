import multiparty from 'multiparty';

// Fills an object with the request body, and defaults
async function defaultParameters(req, listParam = [], valueParam = []) {
    let obj = Object.assign({}, req.params);

    if (req.headers['content-type'] && req.headers['content-type'].toLowerCase().includes('multipart/form-data')) {
        let {files, fields} = await parseMultipart(req);

        Object.assign(obj, fields);
        obj.urls = files;
    }

    // Combine the lists in the body/query params
    listParam.forEach(x => {
        obj[x] = (obj[x] || []).concat(req.body[x] || []);

        if (req.query[x]) {
            obj[x] = obj[x].concat(req.query[x].split(','));
        }
    });

    // Default assign the other values if not specified
    valueParam.forEach(x => {
        obj[x.key] = obj[x.key] || req.body[x.key] || req.query[x.key] || x.default;

        // Cast everything in case it came from query parameters
        obj[x.key] = x.type ? x.type(obj[x.key]) : obj[x.key];
    });

    return obj;
}

function parseMultipart(req) {
    let count = 0;
    let form = new multiparty.Form({uploadDir: 'tmp/images'});
    let obj = {};
     
    let promise = new Promise((resolve, reject) => {
        form.parse(req, function(err, fields, files) {
            if (err) {
                reject(err);
            }

            resolve({fields, files: files.fileToUpload});
        });  
    });

    return promise;
}

export default {
    defaultParameters
};
