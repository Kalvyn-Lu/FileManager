import immutable from 'immutable';

const _unlistener = Symbol('listenWithMixin._unlistener');

function listenWithMixin(listenable, cb) {
    if (!(cb instanceof Function) && typeof cb !== 'string') {
        throw new Error('Must provide callback function or method name for action.listenWith mixin');
    }

    return {
        componentWillMount() {
            if (typeof cb === 'string') {
                cb = this[cb];
            } else {
                cb = cb.bind(this);
            }
            this[_unlistener] = listenable.listen(cb);
        },
        componentWillUnmount() {
            this[_unlistener]();
        }
    };
}

export default function createAction(fn) {
    let listeners = immutable.List();

    function unlisten(tup) {
        let ix = listeners.indexOf(tup);
        if (ix !== -1) {
            listeners = listeners.delete(ix);
        }
    }

    function listen(resolve, reject) {
        if (!resolve && !reject) {
            throw new Error('Must specify at least one callback');
        }

        if ((resolve && !(resolve instanceof Function))
                || (reject && !(reject instanceof Function))) {
            throw new Error('Callback must be a function');
        }

        let tuple = [resolve, reject];
        listeners = listeners.push(tuple);
        return () => unlisten(tuple);
    }

    function runResolve(val) {
        listeners.forEach(tup => tup[0] && tup[0](val));
        return val;
    }

    function runReject(e) {
        listeners.forEach(tup => tup[1] && tup[1](e));
        throw e;
    }

    function emit(...args) {
        if (fn !== undefined) {
            let result, error;
            try {
                result = fn(...args);
            } catch (e) {
                error = e;
            }

            if (result instanceof Promise) {
                return result.then(runResolve, runReject);
            } else if (!result && error) {
                return Promise.resolve(error).then(runReject);
            } else {
                return Promise.resolve(result).then(runResolve);
            }
        } else {
            try {
                // No pre-emit function, run synchronously
                return Promise.resolve(runResolve(args[0]));
            } catch (e) {
                return Promise.reject(e);
            }
        }
    }

    emit.listen = listen;
    emit.hasListeners = () => !listeners.isEmpty();
    emit.listenWith = (cb) => listenWithMixin(emit, cb);
    return emit;
}
