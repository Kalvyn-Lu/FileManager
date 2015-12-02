export default {
    success: (res, headers = {}) => (response) => {
        Object.keys(headers).forEach(key => {
            let value = headers[key];
            res.setHeader(key, value);
        });

        res.status(200).send(response);
    },
    failure: (res) => (err) => {
        if (err.code && err.message) {
            res.status(400).send(err);
        } else {
            console.log(err, JSON.stringify(err));
            res.status(500).send({code: 0, message: 'Internal Server Error'});
        }
    }
};
