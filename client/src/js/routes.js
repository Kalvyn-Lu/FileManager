import Shell from './component/Shell';
import {routeNames} from 'constants';

import {Router, Route, IndexRoute, RouteHandler, Redirect} from './component/router-jsx';
import fsView from './component/fsView';

// Configure routes
// react-router expects JSX-compatible elements for its handlers
const routes =
    Route({handler: Shell.jsx},
        Redirect({from: '/', to: routeNames.fs}),
        Route({name: routeNames.fs, handler: fsView.jsx})
    );

export function runRouter(callback) {
    Router.run(routes, Router.HistoryLocation, callback);
}
