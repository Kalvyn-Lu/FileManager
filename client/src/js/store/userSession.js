import immutable from 'immutable';
import {createAction, createStore} from 'flux';
import rest from '../rest';
import {roles, urls} from 'constants';

const storagePath = '__pp_auth__';
const defaultState = {role: roles.unauthed};

function persist(auth) {
    localStorage[storagePath] = JSON.stringify(auth);
}
function fetchAuth() {
    let value = localStorage[storagePath];

    return value ? JSON.parse(value) : defaultState;
}

const oauth_path = 'api/v1/oauth/access_token';
const store = createStore(fetchAuth());

async function authenticate(username, password) {
    let authPost = {
        grant_type: 'password',
        username,
        password
    };

    // Fetch a user token, and our user id
    let authData = await rest.post(oauth_path, authPost);
    store.cursor().merge(authData);

    let userData = await rest.get(`${urls.users}/self`);

    // Merge it all together, and set the auth flags
    // Setting the role here is a hack until we get real roles from the server
    let data = authData.merge(userData);
    data = data.set('role', roles.admin);

    // Persist it all to local storage, and put it into our store
    persist(data);
    store.cursor().merge(data);

    return data;
}

function createAccount(email, password) {
    return rest.post(urls.users, {email, password}).then(_ => authenticate(email, password));
}

function signOut() {
    let promise = new Promise((resolve, reject) => {
        persist({});
        store.cursor().set('role', roles.unauthed).remove('access_token');

        resolve(true);
    });

    return promise;
}

const actions = {
    authenticate: createAction(authenticate),
    signOut: createAction(signOut),
    createAccount: createAction(createAccount)
};

export default {
    actions,
    store: store.public
};
