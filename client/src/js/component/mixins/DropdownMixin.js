import React from 'react';
import {keys} from 'constants';

// If the click originated from within this component don't do anything.
function defaultNodeinRoot(node, root, key) {
    while (node && node !== document) {
        if (node === root || node.getAttribute('data-dropdown-key') === key) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function handleKeyUp(handler) {
    return e => {
        if (e.keyCode === keys.esc) {
            handler();
        }
    };
}

function handleClick(allowedTarget, handler) {
    return e => {
        if (!allowedTarget(e.target)) {
            handler();
        }
    };
}

function bindHandlers(isNodeInRoot, handler) {
    let allowedTarget = tgt => isNodeInRoot(tgt, React.findDOMNode(this), this.props.dropdownKey);
    let clickHandler = handleClick(allowedTarget, handler);
    let keyHandler = handleKeyUp(handler);
    document.addEventListener('click', clickHandler);
    document.addEventListener('keyup', keyHandler);
    return () => {
        document.removeEventListener('click', clickHandler);
        document.removeEventListener('keyup', keyHandler);
    };
}

export default (closeDropdown, isNodeInRoot = defaultNodeinRoot) => ({
    componentDidMount: function () {
        this.unbindRootCloseHandlers = bindHandlers.call(this, isNodeInRoot, closeDropdown.bind(this));
    },
    componentWillUnmount: function () {
        if (this.unbindRootCloseHandlers) {
            this.unbindRootCloseHandlers();
        }
    }
});
