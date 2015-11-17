import classnames from 'classnames';
import {PropTypes} from 'react';

import {CustomPropTypes} from '../reactHelpers';

function callWithArgs() {
    let self = this;
    let bound = arguments;

    return function() {
        for (let i = 0; i < bound.length; i++) {
            if (bound[i]) {
                bound[i].apply(self, arguments);
            }
        }
    };
}

export default {
    propTypes: {
        // Data describing the items in the sortable collection, and the current thing being dragged
        //  { dragging, items}
        sortableData: CustomPropTypes.immutableMap,

        // Function for committing the changes once an element is dropped somewhere
        commit: PropTypes.func,

        // Function for updating the UI while sorting. THIS WILL BE CALLED FREQUENTLY SO BE CAREFUL IN HOW YOU USE IT
        sort: PropTypes.func,

        // The index of this element in the collection.
        'data-sort': PropTypes.number,

        // The dropkey for this collection, used for tying together like groups of droppable zones.
        'data-drop-key': PropTypes.string
    },

    update(to) {
        let start = this.props.sortableData.get('dragging');
        let data = this.props.sortableData.get('items');
        let adjust = start > to ? 1 : 0;

        // Ignore when we are dragging on ourself, which doesn't require any UI updates
        if (start !== to && start !== null) {
            let updated = data.splice(to, 0, data.get(start));
            updated = updated.splice(start + adjust, 1);
            to = to + adjust - 1;

            this.props.sort(updated, to);
        }
    },

    sortEnd() {
        this.props.commit(this.props.sortableData.get('items'), null);
    },

    sortStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', '');
    },

    dragOver(e) {
        e.preventDefault();

        // Make sure we only accept dragOver's from our given drop-key
        if (e.currentTarget.dataset.dropKey !== this.props['data-drop-key']) {
            return;
        }

        let over = e.currentTarget;
        let relY = e.clientY - over.getBoundingClientRect().top;
        let height = over.offsetHeight / 2;

        // If we are on the bottom half of an element, then we want to append
        //  Otherwise, this defaults to a prepend
        let adjust = relY > height ? 1 : 0;

        this.update(Number(over.dataset.sort) + adjust);
    },

    isDragging() {
        return this.props.sortableData.get('dragging') === this.props['data-sort'];
    },

    sortableClassSpec(key, className) {
        return {
            className: classnames(this.props.className, className, {
                dragging: this.isDragging(),
                dropZone: this.isDragging(),
                draggable: !this.isDragging()
            }),
            draggable: true,
            onDrop: this.sortEnd,
            onDragEnd: callWithArgs(this.sortEnd, this.props.onDragOver),
            onDragOver: callWithArgs(this.dragOver, this.props.onDragOver),
            onDragStart: callWithArgs(this.sortStart, this.props.onDragStart)
        };
    }
};
