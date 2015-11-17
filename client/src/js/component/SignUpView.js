import React from 'react';
const {div, span, h1, ul, li, a, button} = React.DOM;
import component from 'component';
import {Link, Router} from './router-jsx';
import {routeNames, keys} from 'constants';
import {Input, Glyph, ProgressBar} from '../react-bootstrap-jsx';

import userSession from '../store/userSession';

const isSocialEnabled = false;

export default component({
    displayName: 'SignUpView',

    mixins: [Router.Navigation],

    render() {
        let lockGlyph = Glyph({glyph: 'lock'});
        let emailGlyph = Glyph({glyph: 'envelope'});

        let emailValidation;
        let emailValidationState = this.getViewState('isEmailInvalid');
        if (emailValidationState === false) {
            emailValidation = {
                bsStyle: 'error',
                help: 'Enter a valid email!'
            };
        } else if (emailValidationState) {
            emailValidation = {
                bsStyle: 'success'
            };
        }

        let passwordValidation;
        let passwordValidationState = this.getViewState('isPasswordValid');
        if (this.getViewState('isPasswordValid') === false) {
            passwordValidation = {
                bsStyle: 'error',
                help: 'Password must be 8 characters or longer'
            };
        } else if (passwordValidationState) {
            passwordValidation = {
                bsStyle: 'success'
            };
        }

        return div({className: 'sh-login-page margin-top-xl'},
            div({className: 'sh-login-input-container'},
                Input({type:'email',
                    placeholder: 'Email',
                    onChange: this.bindToState('email'),
                    onBlur: this.validateEmail,
                    addonBefore: emailGlyph,
                    onKeyDown: this.onInputKeyDown,
                    ...emailValidation
                }),
                Input({type:'password',
                    placeholder: 'Password',
                    onChange: this.bindToState('password'),
                    onBlur: this.validatePassword,
                    addonBefore: lockGlyph,
                    onKeyDown: this.onInputKeyDown,
                    ...passwordValidation
                })
            ),
            div({className: 'clearfix'},
                this.renderSubmitButton()
            ),
            this.renderSocial(),
            div({}, Link({to: routeNames.login, className: 'margin-xl'}, 'Login'))
        );
    },

    renderSubmitButton() {
        if (this.getViewState('isLoading')) {
            return ProgressBar({active: true, now: 100});
        } else {
            return button({className: 'btn btn-primary right', onClick: this.onSubmit}, 'Register');
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

    bindToState(keyPath) {
        return e => this.setViewState(keyPath, e.target.value);
    },

    onSubmit() {
        this.validateEmail();
        this.validatePassword();

        if (this.getViewState('isEmailInvalid') && this.getViewState('isPasswordValid')) {
            this.setViewState('isLoading', true);
            userSession.actions.createAccount(this.getViewState('email'), this.getViewState('password'))
                .then(result => {
                    if (result) {
                        this.transitionTo(routeNames.admin.default);
                    } else {
                        this.setViewState('isLoading', false);
                    }
                });
        }
    },

    onInputKeyDown(e) {
        if (e.keyCode === keys.enter) {
            this.onSubmit();
        }
    },

    validateEmail() {
        let email = this.getViewState('email', '');
        let re = /^.+@.+/i;

        this.setViewState('isEmailInvalid', re.test(email));
    },

    validatePassword() {
        let pw = this.getViewState('password', '');

        this.setViewState('isPasswordValid', pw.length >= 8);
    }
});
