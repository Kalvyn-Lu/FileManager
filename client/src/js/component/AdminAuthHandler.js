import React from 'react';
const {div, span, h1} = React.DOM;
import component from 'component';
import {routeNames} from 'constants';
import {RouteHandler, Router} from './router-jsx';

import LeftNav from './LeftNav';

export default component({
    displayName: 'LoginView',

    mixins: [Router.State, Router.Navigation],

    componentWillMount() {
        console.log(this.isLoggedIn());
        this.redirectToLogin();
    },

    componentWillUpdate() {
        this.redirectToLogin();
    },

    redirectToLogin() {
        if (!this.isLoggedIn()) {
            this.transitionTo(routeNames.login);
        }
    },

    render() {
        return div({className: 'fm-auth-content'},
            LeftNav(),
            div({className: 'fm-content'},
                RouteHandler()
            )
        );
    }
});
