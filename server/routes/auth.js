import sha256 from 'sha256';

const salt = 'edf6c17b49550fae3b71d07cf2c51e5c4fa0afdbb57e23493b59f7d0f9dffcaa';

function writeFailedAuthResponse(res) {
    res.status(403).send({code: 12, message: 'Forbidden'});
}

function verify(cb) {
    return (req, res) => {
        let {user, key} = req.query;

        let authHeader = req.headers.Authorization;
        if (authHeader) {
            let buffer = (new Buffer(authHeader, 'base64')).toString('utf8');
            let parts = buffer.split(':');

            [user, key] = parts;
        }

        // If we were unable to pull out the credentials
        if (user === undefined || key === undefined) {
            writeFailedAuthResponse(res);
        }

        // Check to see if this matches our naive salting scheme
        let salted = user + salt;
        if (sha256(salted) !== key) {
            writeFailedAuthResponse(res);
        }

        cb(req, res);
    };
}

export default verify;
