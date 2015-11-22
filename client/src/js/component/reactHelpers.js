import React from 'react';
import immutable from 'immutable';

function immutableMap(props, propName, componentName, type, isRequired) {
    if ((isRequired || props[propName] !== undefined) && !immutable.Map.isMap(props[propName])) {
        return new Error(`'${propName}' on ${componentName} is not immutable.Map.`);
    }
}

immutableMap.isRequired = function immutableMapRequired(props, propName, componentName, type) {
    return immutableMap(props, propName, componentName, type, true);
};

function immutableList(props, propName, componentName, type, isRequired) {
    if ((isRequired || props[propName] !== undefined) && !immutable.List.isList(props[propName])) {
        return new Error(`'${propName}' on ${componentName} is not immutable.List.`);
    }
}

immutableList.isRequired = function immutableListRequired(props, propName, componentName, type) {
    return immutableList(props, propName, componentName, type, true);
};

function mountable(props, propName, componentName, type, isRequired) {
    if (isRequired || props[propName] !== undefined) {
        const prop = props[propName];
        if (!(prop instanceof Object) || !(prop.render instanceof Function || prop.nodeType === 1)) {
            return new Error(`'${propName}' on ${componentName} is not a DOM element or an object with a render() method.`);
        }
    }
}

mountable.isRequired = function mountableRequired(props, propName, componentName, type) {
    return mountable(props, propName, componentName, type, true);
};

export const CustomPropTypes = {
    immutableMap,
    immutableList,
    mountable,
    stringsOrKvp: React.PropTypes.array
    // stringsOrKvp: React.PropTypes.arrayOf(
    //     React.PropTypes.oneOfType([
    //         React.PropTypes.string,
    //         React.PropTypes.shape({
    //             key: React.PropTypes.string,
    //             value: React.PropTypes.string
    //         })
    //     ])
    // )
};

export let nbsp = '\u00a0';

let comparator;
if (typeof Intl !== 'undefined' && Intl.Collator) {
    comparator = new Intl.Collator('en', {numeric: true});
} else {
    // Safari doesn't support Intl.Collator
    comparator = {
        compare(a, b) {
            return a.localeCompare(b, 'en', {numeric: true});
        }
    };
}

// A comparator that sorts values using numeric collation (i.e. '1' < '2' < '10')
export const numericComparator = comparator;
