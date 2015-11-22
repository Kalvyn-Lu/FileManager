import immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';
import createAction from './createAction';
import {getKeyPath, forEachDeep} from './utils';

const emptyMap = immutable.Map();
const _unlistener = Symbol('connectMixin._unlistener');

function connectMixin(getStore, listenOn, keyOrPath, name) {
    if (name === undefined) {
        throw new Error('Must provide state name for store.connectTo mixin');
    }

    return {
        componentWillMount() {
            let updateFn;
            if (this.setViewState) {
                updateFn = store => {
                    if (store === undefined
                            || (immutable.Iterable.isIterable(store) && store.isEmpty())) {
                        this.removeViewState(name);
                    } else {
                        this.replaceViewState(name, store);
                    }
                };
            } else {
                updateFn = store => this.setState({[name]: store});
            }

            updateFn(getStore(keyOrPath));
            this[_unlistener] = listenOn(keyOrPath, updateFn);
        },
        componentWillUnmount() {
            this[_unlistener]();
        }
    };
}

const listenerKey = '@@wFlux/storeListener';

export default function createStore(initialValue) {
    if (initialValue !== undefined && !(initialValue instanceof Object)) {
        throw new Error('Initial value for store must be object or undefined');
    }

    let store = initialValue ? immutable.fromJS(initialValue) : emptyMap;
    let pathListeners = emptyMap;

    function callListeners(oldStore, changedPath) {
        if (pathListeners.isEmpty()) {
            return;
        }

        // Fire global listener
        let axn = pathListeners.get(listenerKey);
        if (axn) {
            if (axn.hasListeners()) {
                axn(store, oldStore, changedPath);
            } else {
                pathListeners = pathListeners.remove(listenerKey);
            }
        }

        // Fire sub-path listeners
        let newStore = store;
        let listeners = pathListeners;
        let updatePath = [...changedPath];
        for (let i = 0; i < changedPath.length; i++) {
            let nextKey = updatePath.shift();
            listeners = listeners.get(nextKey);
            if (listeners === undefined) {
                // No more listeners at or below current sub-path
                return;
            }

            newStore = newStore.get(nextKey, emptyMap);
            oldStore = oldStore.get(nextKey, emptyMap);
            axn = listeners.get(listenerKey);
            if (axn) {
                if (axn.hasListeners()) {
                    axn(newStore, oldStore, updatePath);
                } else {
                    let listenerPath = changedPath.slice(0, i + 1).concat(listenerKey);
                    pathListeners = pathListeners.removeIn(listenerPath);
                }
            }
        }

        // Fire listeners below sub-path
        forEachDeep(listeners, function emit(listener, key) {
            let last = key.pop();
            if (last !== listenerKey) {
                // We only care about listeners
                return;
            }

            if (key.length === 0) {
                // Skip listener at current level, previous section already called it
                return;
            }

            if (listener.hasListeners()) {
                let _new = newStore.getIn(key);
                let _old = oldStore.getIn(key);
                if (_new !== _old) {
                    listener(_new, _old, []);
                }
            } else {
                pathListeners = pathListeners.removeIn(changedPath.concat(key, listenerKey));
            }
        });
    }

    // Shamelessly stolen from Immstruct
    function onUpdate(newStore, oldStore, changedPath) {
        if (store === newStore) {
            // Nothing happened.
            return store;
        }

        if (store === oldStore) {
            store = newStore;
        } else if (!newStore.hasIn(changedPath)) {
            // Otherwise an out-of-sync change occured. We ignore `oldStore`, and focus on
            // changes at path `changedPath`, and sync this to `store`.
            store = store.removeIn(changedPath);
        } else {
            // Update an existing path or add a new path within the current map.
            store = store.setIn(changedPath, newStore.getIn(changedPath));
        }

        callListeners(oldStore, changedPath);
        return store;
    }

    function listenOn(keyOrPath, cb) {
        let listenerPath = getKeyPath(keyOrPath).concat(listenerKey);
        let listener = pathListeners.getIn(listenerPath);
        if (listener === undefined) {
            listener = createAction();
            pathListeners = pathListeners.setIn(listenerPath, listener);
        }

        return listener.listen(cb);
    }

    function getStore(keyOrPath) {
        return store.getIn(getKeyPath(keyOrPath));
    }

    function listen(cb) {
        return listenOn([], cb);
    }

    return {
        get current() {
            return store;
        },
        cursor(keyOrPath = []) {
            return Cursor.from(store, keyOrPath, onUpdate);
        },
        listen,
        listenOn,
        public: {
            get current() {
                return store;
            },
            listen,
            listenOn,
            connectTo(keyOrPath, name) {
                if (name === undefined) {
                    name = keyOrPath;
                    keyOrPath = [];
                }
                return connectMixin(getStore, listenOn, keyOrPath, name);
            }
        }
    };
}
