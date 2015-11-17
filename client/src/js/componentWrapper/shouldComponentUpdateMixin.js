import immutable from 'immutable';

// Performs a compare of two object maps.
function isEqual(objA, objB, ...ignoredKeys) {
    if (objA === objB) {
        // Reference equality
        return true;
    }

    if (!objA !== !objB) {
        // Either one undefined/null but not both
        return false;
    }

    let keysA = immutable.Set.fromKeys(objA);
    let keysB = immutable.Set.fromKeys(objB);
    let keys = keysA.union(keysB).subtract(ignoredKeys);

    return keys.every(key => {
        // Use Immutable.js's equivalence algorithm. Note that StoreRef and
        // QueryData implement valueOf() or equals()/hashCode(), which this
        // algorithm uses for comparisons.
        return immutable.is(objA[key], objB[key]);
    });
}

let debug = function() {}; // eslint-disable-line func-style

function shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.state, nextState)) {
        debug(`SCU state changed for ${this.constructor.displayName || 'unnamed component'}, state: `, this.state, nextState, 'props: ', this.props, nextProps);
        return true;
    }

    if (!isEqual(this.props, nextProps, 'children')) {
        debug(`SCU props changed for ${this.constructor.displayName || 'unnamed component'}, state: `, this.state, nextState, 'props: ', this.props, nextProps);
        return true;
    }

    debug(`SCU no update for ${this.constructor.displayName || 'unnamed component'}, state: `, this.state, nextState, 'props: ', this.props, nextProps);
    return false;
}

shouldComponentUpdate.debug = function() {
    debug = console.debug.bind(console); //eslint-disable-line no-console
};

export default {shouldComponentUpdate};
