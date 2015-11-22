const notKeyOrPath = Symbol('@@QueryComponent/notKeyOrPath');

// Takes a value that may or may not be a key or key path, and returns a proper
// key path if possible. If `keyOrPath` is not a key or key path, and cannot be
// transformed, a Symbol is returned to indicate the failure.
function getKeyPathCore(keyOrPath) {
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

    return notKeyOrPath;
}

// Returns a value indicating whether `maybeKeyOrPath` is, or can be transformed
// to, a key path.
export function isKeyOrPath(maybeKeyOrPath) {
    return getKeyPathCore(maybeKeyOrPath) !== notKeyOrPath;
}

// Takes a single key or key path (or nothing) and returns a proper key path
// that can be used on immutable data structures. If `keyOrPath` cannot be
// resolved as a key path, an Error is thrown.
export function getKeyPath(keyOrPath) {
    let keypath = getKeyPathCore(keyOrPath);

    if (keypath === notKeyOrPath) {
        throw new Error(`Can't figure out key path for '${keyOrPath}'`);
    }

    return keypath;
}
