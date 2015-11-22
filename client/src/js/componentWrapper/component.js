import React from 'react';
import viewStateMixin from './viewStateMixin';
import userSession from '../store/userSession';
import {emptyMap, roles} from 'constants';

let componentMixin = {
    isLoggedIn() {
        return this.getUserRole() !== roles.unauthed;
    },

    getUserRole() {
        return this.getViewState(['stores', 'session', 'role']);
    },

    getSession(keyOrPath, defaultValue) {
        return this.getViewState(this.getSessionPath(keyOrPath), defaultValue);
    },

    getSessionPath(keyOrPath) {
        return ['stores', 'session'].concat(keyOrPath);
    }
};

export default spec => {
    let {displayName, mixins, propTypes, render: renderComponent, ...componentSpec} = spec;

    // Enforce component display name
    if (!displayName) {
        throw new Error('No displayName specified.');
    }

    // Create React component
    let componentClass = React.createClass(Object.assign(componentSpec, {
        displayName,
        mixins: [
            viewStateMixin,
            componentMixin,
            userSession.store.connectTo(['stores', 'session'])
        ].concat(mixins),

        propTypes,
        render() {
            // Pass query data to render method, if available
            return renderComponent.call(this);
        }
    }));

    let componentFactory = React.createFactory(componentClass);
    componentFactory.jsx = componentClass; // For consumers that use JSX

    return componentFactory;
};
