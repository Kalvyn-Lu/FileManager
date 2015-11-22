import React from 'react';
const {div} = React.DOM;
import Notification from './ui/Notification';
import Router, {RouteHandler} from './router-jsx';
import {routeNames} from 'constants';
import component from 'component';

import Header from './Header';

export default component({
    displayName: 'Shell',

    render() {
        return div({},
          'fsView'
        );
    }
});
