import immutable from 'immutable';

// Takes a single key or key path (or nothing) and returns a proper key path
// that can be used on immutable data structures. If `keyOrPath` cannot be
// resolved as a key path, an Error is thrown.
export function getKeyPath(keyOrPath) {
    if (keyOrPath === undefined) {
        return [];
    }

    if (typeof keyOrPath === 'string' ||
        typeof keyOrPath === 'number') {
        return [keyOrPath];
    }

    if (Array.isArray(keyOrPath)) {
        return keyOrPath;
    }

    throw new Error(`Can't figure out key path for '${keyOrPath}'`);
}

function isIterable(maybeIterable) {
    return maybeIterable && immutable.Iterable.isIterable(maybeIterable);
}

// Executes a function `fn(value, key)` on all nested iterable values in
// breadth–first order. `fn` is called with two parameters: `value` is any
// non–iterable node encountered in `iterable`; `key` is an array of the full
// key to reach `value` from `iterable`.
export function forEachDeep(iterable, fn) {
    if (!isIterable(iterable) || iterable.isEmpty()) {
        return;
    }

    let queue = iterable.entrySeq().toList().asMutable();
    while (!queue.isEmpty()) {
        let [key, val] = queue.first();
        queue = queue.shift();

        if (!Array.isArray(key)) {
            key = [key];
        }

        if (isIterable(val)) {
            queue = queue.concat(val.map((v, k) => [key.concat(k), v])); //eslint-disable-line no-loop-func
        } else {
            fn(val, key);
        }
    }
}
