import React from 'react';
const {div, span} = React.DOM;
import component from 'component';
import {Link} from './router-jsx';
import {routeNames} from 'constants';

export default component({
    displayName: 'Header',

    render() {
        return div({className: 'fm-header'},
            span({className: 'fm-header-title'}, 'File Manager'),
            Link({className: 'fm-header-link', to: routeNames.recordList}, 'Records'),
            Link({className: 'fm-header-link', to: routeNames.fileList}, 'Files'),
            Link({className: 'fm-header-link', to: routeNames.createFile}, 'Create File')
        );
    }
});
