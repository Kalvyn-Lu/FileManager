import React from 'react';
const {div, span} = React.DOM;
import component from 'component';

import ReactDropzoneClass from 'react-dropzone';
const ReactDropzone = React.createFactory(ReactDropzoneClass);

export default component({
    displayName: 'Header',

    render() {
        return div({className: 'fm-header'},
            span({className: 'fm-header-title'}, 'File Manager'),
            ReactDropzone({onDrop: this.onDrop})
        );
    },

    onDrop(x) {
        console.log(x);
    }
});
