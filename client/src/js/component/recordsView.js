import React from 'react';
const {div} = React.DOM;
import {emptyList} from 'constants';
import component from 'component';
import records from '../store/records';

const recordPath = ['@@recordsView/records'];

export default component({
    displayName: 'recordsView',

    mixins: [records.store.connectTo([], recordPath)],

    componentDidMount() {
        records.actions.fetchRecords();
    },

    render() {
        console.log(this.getViewState().toJS());
        let recordList = this.getViewState(recordPath, emptyList);

        return div({},
            recordList.map(x => div({}, JSON.stringify(x.toJS())))
        );
    }
});
