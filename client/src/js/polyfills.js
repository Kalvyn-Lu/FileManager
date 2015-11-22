require('babel/polyfill');

// Required for IE
if (!window.location.origin) {
    let port = (window.location.port ? ':' + window.location.port: '');
    window.location.origin = window.location.protocol + '//' + window.location.hostname + port;
}

export default true;
