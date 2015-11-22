import immutable from 'immutable';
import uuid from 'tiny-uuid';
import {createStore} from 'flux';
import {isKeyOrPath, getKeyPath} from './utils';

const viewStateStore = createStore();
const _componentId = Symbol('@@ViewStateMixin/componentId');
const _unlistener = Symbol('@@ViewStateMixin/unlistener');
export const stateKey = '@@ViewStateMixin/viewState';

function getState(componentId) {
    return viewStateStore.current.get(componentId) || immutable.Map();
}

function setState(componentId, state) {
    viewStateStore.cursor().set(componentId, state);
}

function removeState(componentId) {
    viewStateStore.cursor().remove(componentId);
}

// Mixin for view state management functions.
export default {
    // Gets the current view state. 'keyOrPath' is an optional string or array
    // of strings. If no key path is given, the entire view state is returned,
    // or an empty immutable.Map if no view state values have been set.
    // 'defaultValue' is an optional value to return if there is no value set at
    // the given key path.
    getViewState(keyOrPath, defaultValue) {
        let keyPath = getKeyPath(keyOrPath);
        if (keyPath.length === 0 && defaultValue === undefined) {
            defaultValue = immutable.Map();
        }
        return getState(this[_componentId]).getIn(keyPath, defaultValue);
    },

    // Gets a value indicating whether a value is set at 'keyOrPath'.
    // 'keyOrPath' is an optional string or array of strings.
    hasViewState(keyOrPath) {
        let keyPath = getKeyPath(keyOrPath);
        return getState(this[_componentId]).hasIn(keyPath);
    },

    // Compares the value of the current view state with 'expectedValue' using
    // strict equality. 'keyOrPath' is a string or array of strings - unlike
    // other methods, this parameter is not optional.
    viewStateEquals(keyOrPath, expectedValue) {
        return this.getViewState(keyOrPath) === expectedValue;
    },

    // Sets the view state. 'keyOrPath' is an optional string or array of
    // strings. 'partialState' is an object, which is passed to immutable.fromJS
    // before merging, or a primitive.
    //
    // If `partialState` is undefined, and `keyOrPath` is a proper key or key
    // path, the view state at `keyOrPath` is removed instead, as if
    // removeViewState(keyOrPath) was called.
    //
    // If 'partialState' is an object or map, this method will perform a shallow
    // merge, which means that the presence of nested non-primitives in
    // 'partialState' will always trigger a component update! Judicious use of
    // 'keyOrPath' may help avoid this.
    setViewState(keyOrPath, partialState) {
        if (partialState === undefined) {
            if (isKeyOrPath(keyOrPath)) {
                // setViewState with key path and `undefined` partialState ->
                // forward to removeViewState
                return this.removeViewState(keyOrPath);
            } else {
                partialState = keyOrPath;
                keyOrPath = undefined;
            }
        }

        let keyPath = getKeyPath(keyOrPath);
        if (!(partialState instanceof Object)) {
            if (keyPath.length > 0) {
                partialState = {[keyPath.pop()]: partialState};
            } else {
                throw new Error("Illegal arguments! Acceptable calls are setViewState('key', value), setViewState(['key', ...], value), or setViewState({key: value ...})");
            }
        }

        let immPartial = immutable.fromJS(partialState);
        let nextState;
        if (immutable.Iterable.isIndexed(immPartial)) {
            nextState = this.getViewState().setIn(keyPath, immPartial);
        } else {
            nextState = this.getViewState().mergeIn(keyPath, immPartial);
        }

        this.replaceViewState(nextState);
    },

    // Updates the view state using an updater function. 'keyOrPath' is an
    // optional string or array of strings. 'updateFn' is a function of the form
    // '(currentState) => nextState', where currentState is the same value that
    // would be returned from getViewState(keyOrPath).
    updateViewState(keyOrPath, updateFn) {
        if (updateFn === undefined) {
            updateFn = keyOrPath;
            keyOrPath = undefined;
        }

        if (!(updateFn instanceof Function)) {
            throw new Error('Updater function must be a function');
        }

        let keyPath = getKeyPath(keyOrPath);
        let partialState = updateFn(this.getViewState(keyPath));
        this.setViewState(keyPath, partialState);
    },

    // Toggles a boolean value. `keyOrPath` is a string or array of strings.
    toggleViewState(keyOrPath) {
        if (keyOrPath === undefined) {
            throw new Error('Must specify a key or key path');
        }
        return this.updateViewState(keyOrPath, x => !x);
    },

    // Removes a key or path within the view state. 'keyOrPath' is an optional
    // string or array of strings. Not specifying it, or specifying `undefined`
    // or an empty array, clears the view state for this component.
    removeViewState(keyOrPath) {
        let nextState;
        let keyPath = getKeyPath(keyOrPath);
        if (keyPath.length === 0) {
            nextState = {};
        } else {
            nextState = this.getViewState().removeIn(getKeyPath(keyOrPath));
        }

        this.replaceViewState(nextState);
    },

    // Replaces the entire view state with the given object.
    replaceViewState(keyOrPath, nextState) {
        if (nextState === undefined) {
            nextState = keyOrPath;
            keyOrPath = [];
        }

        if (!(nextState instanceof Object)) {
            throw new Error('State must be an object');
        }

        if (!this[_unlistener]) {
            this[_unlistener] = viewStateStore.listenOn(this[_componentId], x => this.setState({[stateKey]: x}));
        }

        let keyPath = getKeyPath(keyOrPath);
        let currentState = this.getViewState();
        let nextImmState = currentState.setIn(keyPath, immutable.fromJS(nextState));

        setState(this[_componentId], nextImmState);
    },

    // Returns a value link that can be used for two-way binding with view
    // state. `keyOrPath` is a string or array of strings.
    //
    // See https://facebook.github.io/react/docs/two-way-binding-helpers.html
    // for React's LinkedStateMixin, which works in a similar manner.
    linkViewState(keyOrPath) {
        if (keyOrPath === undefined) {
            throw new Error('Must specify a key or key path');
        }

        return {
            value: this.getViewState(keyOrPath),
            requestChange: newValue => this.setViewState(keyOrPath, newValue)
        };
    },

    componentWillMount() {
        this[_componentId] = uuid();
        this[_unlistener] = null;

        if (this.getInitialState) {
            let initState = this.getInitialState();
            if (initState) {
                this.replaceViewState(initState);
            }
        }
    },

    // Cleans up data used by this mixin
    componentWillUnmount() {
        if (this[_unlistener]) {
            this[_unlistener]();
        }

        removeState(this[_componentId]);
    }
};
