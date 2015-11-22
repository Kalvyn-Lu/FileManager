import Shell from './component/Shell';
import {routeNames} from 'constants';

import {Router, Route, DefaultRoute, RouteHandler, Redirect} from './component/router-jsx';

// Configure routes
// react-router expects JSX-compatible elements for its handlers
const routes =
    Route({handler: Shell.jsx}
    );

export function runRouter(callback) {
    Router.run(routes, Router.HistoryLocation, callback);
}
