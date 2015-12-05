import React from 'react';
const {div, h4} = React.DOM;
import Router from './router-jsx';
import component from 'component';
import records from '../store/records';
import {emptyMap, emptyList} from 'constants';

const recordPath = ['@@recordsView/record'];

export default component({
    displayName: 'Shell',

    mixins: [
        Router.State,
        Router.Navigation,
        records.store.connectTo([], recordPath)
    ],

    componentDidMount() {
        records.actions.fetchRecord(this.getRecordId());
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.params.recordId !== nextProps.params.recordId) {
            records.actions.fetchRecord(this.getRecordId(nextProps));
        }
    },

    render() {
        let record = this.getViewState(recordPath.concat(this.getRecordId()), emptyMap);
        console.log(record);

        let list = record.get('buffer', emptyList);
        let contents = new Buffer(list).toString();

        return div({className: 'fm-content'},
            h4({className: 'fm-record-view-header'}, `Record View: ${this.getRecordId()}`),
            div({className: 'fm-record-view-size'},
                `Size: ${record.get('size', 0)}`
            ),
            div({className: 'fm-record-view-content-header'}, 'Contents:'),
            div({className: 'fm-record-view-content'}, contents)
        );
    },

    getRecordId(props) {
        return Number(decodeURIComponent((props || this.props).params.recordId));
    }
});
