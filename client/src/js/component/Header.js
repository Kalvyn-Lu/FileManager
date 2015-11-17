import React from 'react';
const {div, span} = React.DOM;
import component from 'component';

import HeaderLogin from './HeaderLogin';

export default component({
    displayName: 'Header',

    render() {
        return div({className: 'sh-header'},
            span({className: 'sh-header-title'}, 'Fast Bible'),
            HeaderLogin({className: 'right'})
        );
    }
});
