import React from 'react';
const {div, span} = React.DOM;
import component from 'component';

import HeaderLogin from './HeaderLogin';

export default component({
    displayName: 'Header',

    render() {
        return div({className: 'fm-header'},
            span({className: 'fm-header-title'}, 'File Manager'),
            HeaderLogin({className: 'right'})
        );
    }
});
