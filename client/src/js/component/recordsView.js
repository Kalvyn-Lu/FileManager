import React from 'react';
const {div} = React.DOM;
import {emptyList} from 'constants';
import component from 'component';
import records from '../store/records';

const recordPath = ['@@recordsView/records'];
const recordSize = 1024;

export default component({
    displayName: 'recordsView',

    mixins: [records.store.connectTo([], recordPath)],

    componentDidMount() {
        records.actions.fetchRecords();
    },

    render() {
        let recordList = this.getViewState(recordPath, emptyList);

        return div({className: 'fm-content'},
            div({className: 'fm-record-list'},
                div({className: 'fm-record-item fm-record-item-header'},
                    div({className: 'fm-record-item-id'}, 'ID'),
                    div({className: 'fm-record-size'}, 'Size'),
                    div({className: 'fm-record-size-bar'}, 'Percent Used')
                ),
                recordList.map(x => {
                    let recordPercent = Math.floor(x.get('size') / recordSize * 100);

                    return div({className: 'fm-record-item'},
                        div({className: 'fm-record-item-id'}, x.get('id')),
                        div({className: 'fm-record-size'}, x.get('size')),
                        div({className: 'fm-record-size-bar'},
                            div({className: 'fm-record-size-bar-fill', style: {width: `${recordPercent}%`}})
                        )
                    );
                })
            )
        );
    }
});
