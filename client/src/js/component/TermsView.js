import React from 'react';
const {div, span, h1} = React.DOM;
import component from 'component';
import {Link} from './router-jsx';

export default component({
    displayName: 'LoginView',

    render() {
        return div({className: 'sh-tos-page'},
            h1({className: 'sh-tos-header'}, 'Terms of Service'),
            div({}, 'insert TOS here')
        );
    }
});
