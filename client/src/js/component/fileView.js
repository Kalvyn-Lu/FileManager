import React from 'react';
const {div, h4} = React.DOM;
import Router from './router-jsx';
import component from 'component';
import files from '../store/files';
import {emptyMap, emptyList,routeNames} from 'constants';
import records from '../store/records';
import immutable from 'immutable';
import {Link} from './router-jsx'

const filePath = ['@@filesView/file'];
const recordPath = ['@@recordsView/records'];
const recordSize = 1024;
export default component({
    displayName: 'Shell',

    mixins: [
        Router.State,
        Router.Navigation,
        files.store.connectTo([], filePath),
        records.store.connectTo([], recordPath)
    ],

    componentDidMount() {
        files.actions.fetchFile(this.getFileId());
        records.actions.fetchRecords();
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.params.fileId !== nextProps.params.fileId) {
            files.actions.fetchFile(this.getFileId(nextProps));
        }
    },

    render() {
        let file = this.getViewState(filePath.concat(this.getFileId()), emptyMap);

        let name = file.get('name');
        let id = file.get('id');
        let records = file.get('records', emptyList);
        let recordMap = this.getViewState(recordPath, emptyList).reduce((a, b) => a.set(b.get('id'), b), emptyMap);
        let maxIndex = this.getViewState(recordPath, emptyList).reduce((a, b) => Math.max(a, b.get('id')), 0) + 1;


        return div({className: 'fm-content'},
            div({className: 'fm-file-view-content-header'},'Name:'),
            div({className: 'fm-file-view-content'},name),

            div({className: 'fm-file-view-content-header'},'ID'),
            div({className: 'fm-file-view-content'}, id),

            div({className: 'fm-record-item-header'},
                div({className: 'fm-record-item-id'}, 'ID'),
                div({className: 'fm-record-size'}, 'Size'),
            ),
            records.map(i => {
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
        );
    },

    getFileId(props) {
        return decodeURIComponent((props || this.props).params.fileId);
    }
});
