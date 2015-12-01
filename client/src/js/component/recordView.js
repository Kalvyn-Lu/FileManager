import React from 'react';
const {div} = React.DOM;
import Router from './router-jsx';
import component from 'component';
import records from '../store/records';
import {emptyMap} from 'constants';

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
        let record = this.getViewState([recordPath, this.getRecordId()], emptyMap);

        return div({},
            'record view',
            JSON.stringify(record.toJS())
        );
    },

    getRecordId(props) {
        return decodeURIComponent((props || this.props).params.recordId);
    }
});
