import React from 'react';
const {div, span, button} = React.DOM;
import component from 'component';
import classnames from 'classnames';
import {Router} from './router-jsx';

import sessionStore from '../store/userSession';

export default component({
    displayName: 'HeaderLogin',

    mixins: [Router.Navigation],

    render() {
        let auth = this.isLoggedIn();
        if (!auth) {
            return null;
        }

        let className = classnames(
            this.props.className,
            'btn btn-link fm-sign-out'
        );
        
        return button({className, onClick: this.onSignOut}, 'Sign Out');
    },

    onSignOut() {
        sessionStore.actions.signOut()
            .then(() => {
                this.transitionTo('/');
            });
    }
});
