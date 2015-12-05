import React from 'react';
const {div} = React.DOM;
import immutable from 'immutable';
import {emptyList, emptyMap, routeNames} from 'constants';
import component from 'component';
import records from '../store/records';

import {Link} from './router-jsx';

const recordPath = ['@@recordsView/records'];
const recordSize = 1024;

export default component({
    displayName: 'recordsView',

    mixins: [records.store.connectTo([], recordPath)],

    componentDidMount() {
        records.actions.fetchRecords();
    },

    render() {
        let recordMap = this.getViewState(recordPath, emptyList).reduce((a, b) => a.set(b.get('id'), b), emptyMap);
        let maxIndex = this.getViewState(recordPath, emptyList).reduce((a, b) => Math.max(a, b.get('id')), 0) + 1;

        return div({className: 'fm-content'},
            div({className: 'fm-record-list'},
                div({className: 'fm-record-item-header'},
                    div({className: 'fm-record-item-id'}, 'ID'),
                    div({className: 'fm-record-size'}, 'Size'),
                    div({className: 'fm-record-size-bar'}, 'Percent Used')
                ),
                immutable.Range(0, maxIndex).map(i => {
                    let record = recordMap.get(i, emptyMap);
                    let recordPercent = Math.floor(record.get('size', 0) / recordSize * 100);

                    return Link({className: 'fm-record-item', to: routeNames.record, params: {recordId: i}},
                        div({className: 'fm-record-item-id'}, i),
                        div({className: 'fm-record-size'}, record.get('size', 0)),
                        div({className: 'fm-record-size-bar'},
                            div({className: 'fm-record-size-bar-fill', style: {width: `${recordPercent}%`}})
                        )
                    );
                })
            )
        );
    }
});
