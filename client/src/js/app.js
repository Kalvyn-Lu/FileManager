let scripts = document.getElementsByTagName('script');
let src = scripts[scripts.length - 1].getAttribute('src');
// Remove js/ from the path
__webpack_public_path__ = src.substr(0, src.lastIndexOf('/') - 2); //eslint-disable-line camelcase, no-undef

// Ensures polyfills are loaded
import polyfills from './polyfills'; //eslint-disable-line no-unused-vars

import React from 'react';
import {runRouter} from 'routes';

// Include styles, html
require('../sass/styles.scss');
// require('../img/favicon.ico');
require('file?name=index.html!../index.html');

function render(handler, state) {
	console.log('mounting');
    React.render(React.createElement(handler), document.getElementById('fm-body'));
}

runRouter(render);
