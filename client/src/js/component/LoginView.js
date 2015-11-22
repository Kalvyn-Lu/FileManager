import React from 'react';
const {div, span, h1, ul, li, a, button} = React.DOM;
import component from 'component';
import {Link, Router} from './router-jsx';
import {routeNames, keys, errorMessages} from 'constants';
import {Input, Glyph, ProgressBar} from '../react-bootstrap-jsx';

import userSession from '../store/userSession';

const isSocialEnabled = false;

let EmailConnect = component({
    displayName: 'EmailConnect',

    mixins: [Router.Navigation],

    render() {
        let lockGlyph = Glyph({glyph: 'lock'});
        let emailGlyph = Glyph({glyph: 'envelope'});

        return div({className: 'fm-login-page margin-top-xl'},
            div({className: 'fm-login-input-container'},
                Input({type:'email',
                    placeholder: 'Email',
                    onChange: this.bindToState('email'),
                    addonBefore: emailGlyph,
                    onKeyDown: this.onInputKeyDown
                }),
                Input({type:'password',
                    placeholder: 'Password',
                    onChange: this.bindToState('password'),
                    addonBefore: lockGlyph,
                    onKeyDown: this.onInputKeyDown
                })
            ),
            this.renderErrorMessage(),
            div({className: 'clearfix'},
                this.renderSubmitButton()
            ),
            this.renderSocial(),
            div({},
                Link({to: routeNames.signup, className: 'margin-xl'}, 'Register')
            )
        );
    },

    renderSubmitButton() {
        if (this.getViewState('isLoading')) {
            return ProgressBar({active: true, now: 100});
        } else {
            return button({className: 'btn btn-primary right', onClick: this.onSubmit}, 'Sign in');
        }
    },

    renderSocial() {
        if (!isSocialEnabled) {
            return null;
        }

        return div({},
            div({className: 'margin-top-xl'}, 'Connect a different way?'),
            ul({className: 'soc margin-top-m'},
                li({}, a({className: 'soc-facebook'})),
                li({}, a({className: 'soc-google soc-icon-last'}))
            )
        );
    },

    renderErrorMessage() {
        return div({className: 'fm-login-page-error'}, this.getViewState('error'));
    },

    bindToState(keyPath) {
        return e => this.setViewState(keyPath, e.target.value);
    },

    onSubmit() {
        this.setViewState('isLoading', true);
        userSession.actions.authenticate(this.getViewState('email'), this.getViewState('password'))
            .then(result => {
                this.setViewState('error', '');
                this.setViewState('isLoading', false);

                if (result) {
                    this.transitionTo(routeNames.admin.default);
                }
            }).catch(e => {
                this.setViewState('isLoading', false);

                let error;
                if (e.response && e.response.body.error === errorMessages.BAD_CREDENTIALS) {
                    error = 'Woops! You entered an invalid email or password';
                } else {
                    error = 'Something went wrong! Try again later';
                }

                this.setViewState('error', error);
            });
    },

    onInputKeyDown(e) {
        if (e.keyCode === keys.enter) {
            this.onSubmit();
        }
    }
});

export default component({
    displayName: 'LoginView',

    render() {
        if (this.getViewState('showEmailLogin') || !isSocialEnabled) {
            return EmailConnect();
        }

        return div({className: 'fm-login-page'},
            div({className: 'fm-login-greeting'}, 'Welcome'),
            div({className: 'fm-login-connect'}, 'Connect with ...'),
            div({className: 'fm-login-icon-container'},
                ul({className: 'soc'},
                    li({}, a({className: 'soc-email1', onClick: this.showEmailLogin})),
                    li({}, a({className: 'soc-facebook'})),
                    li({}, a({className: 'soc-google soc-icon-last'}))
                )
            ),
            div({},
                Link({to: routeNames.SignUp, className: 'margin-xl'}, 'Register')
            )
        );
    },

    showEmailLogin() {
        this.setViewState('showEmailLogin', true);
    },


});
