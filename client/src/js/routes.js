import Shell from './component/Shell';
import {routeNames} from 'constants';

import {Router, Route, DefaultRoute, RouteHandler, Redirect} from './component/router-jsx';

import LoginView from './component/LoginView';
import TermsView from './component/TermsView';
import SignUpView from './component/SignUpView';

// Configure routes
// react-router expects JSX-compatible elements for its handlers
const routes =
    Route({handler: Shell.jsx},
        Redirect({from: '/', to: routeNames.login}),
        Route({name: routeNames.login, handler: LoginView.jsx}),
        Route({name: routeNames.signup, handler: SignUpView.jsx}),
        Route({name: routeNames.TOS, handler: TermsView.jsx})
    );

export function runRouter(callback) {
    Router.run(routes, Router.HistoryLocation, callback);
}
