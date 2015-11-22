import immutable from 'immutable';

export default {
    isImmutable: immutable.Iterable.isIterable,
    emptyMap: immutable.Map(),
    emptyList: immutable.List(),
    emptySet: immutable.Set(),

    routeNames: {
    },

    urls: {
        users: '/api/v1/users'
    },

    keys: {
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        leftArrow: 37,
        upArrow: 38,
        rightArrow: 39,
        downArrow: 40
    },

    roles: {
        admin: 'admin',
        business: 'business',
        user: 'user',
        unauthed: 'unauthed'
    },

    errorMessages: {
        BAD_CREDENTIALS: 'invalid_grant'
    },

    alertDismissAfter: 4500
};
