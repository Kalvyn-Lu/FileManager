import immutable from 'immutable';
import request from 'superagent';

function doRequest(req, headers={}) {
    return new Promise((resolve, reject) => {
        if (headers !== undefined) {
            req = req.set(headers);
        }
        req.withCredentials().end((error, response) => {
            if (error || !response || !response.ok) {
                reject(error || new Error('Unspecified error'));
            } else if (!response.body && response.text) {
                reject(new Error('Response was not parsed as JSON; was Content-Type set to application/json?'));
            } else {
                resolve(immutable.fromJS(response.body));
            }
        });
    });
}

export function get(url, headers) {
    return doRequest(request.get(url), headers);
}

export function post(url, data, headers) {
    let r = request.post(url);
    if (data) {
        r = r.send(data);
    }
    return doRequest(r, headers);
}

export function put(url, data, headers) {
    let r = request.put(url);
    if (data) {
        r = r.send(data);
    }
    return doRequest(r, headers);
}

export function postForm(url, data, headers) {
    return doRequest(request.post(url).type('form').send(data), headers);
}

export function upload(url, fileName, file, headers) {
    return doRequest(request.post(url).field(fileName, file), headers);
}

export function uploadFile(url, contentType, data) {
    return new Promise((resolve, reject) => {
      request.put(url)
        .send(data)
        .type(contentType)
        .end((error, response) => {
          if (error || !response || !response.ok) {
            reject(error || new Error('Unspecified error'));
          } else {
            resolve(url);
          }
        })
    })
}

export function patch(url, data, headers) {
    return doRequest(request.patch(url).send(data), headers);
}

export function del(url, headers) {
    return doRequest(request.del(url), headers);
}

export default {get, post, put, postForm, upload, uploadFile, patch, del};
