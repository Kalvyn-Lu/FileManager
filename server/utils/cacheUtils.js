export function addToCache(cache, key) {
    return x => {
        if (x instanceof Array) {
            x.forEach(item => {
                cache.set(item[key], item);
            });
        } else {

            cache.set(x[key], x);
        }

        return x;
    };
}

export function removeFromCache(cache, key) {
    return x => {
        cache.remove(x[key]);

        return x;
    };
}

// Export a simple function to wrap all of the utils in a closure
export default (cache, key) => {
    return {
        addToCache: addToCache(cache, key),
        removeFromCache: removeFromCache(cache, key)
    };
};
