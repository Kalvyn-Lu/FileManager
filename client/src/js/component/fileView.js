import React from 'react';
const {div, textarea, input} = React.DOM;
import Router from './router-jsx';
import component from 'component';
import files from '../store/files';
import {emptyMap, emptyList,routeNames} from 'constants';
import records from '../store/records';
import {Link} from './router-jsx'
import autosize from 'autosize';

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

    getInitialState() {
        return {
            editText: '',
            editName: ''
        };
    },

    componentDidMount() {
        records.actions.fetchRecords();
        files.actions.fetchFile(this.getFileId()).then(x => {
            this.setViewState('editText', x.get('content'));
            this.setViewState('editName', x.get('name'));
        });

        let elem = React.findDOMNode(this.refs.textarea);
        autosize(elem);
    },

    componentDidUpdate() {
        let elem = React.findDOMNode(this.refs.textarea);
        autosize.update(elem);
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.params.fileId !== nextProps.params.fileId) {
            files.actions.fetchFile(this.getFileId(nextProps)).then(x => {
                this.setViewState('editText', x.get('content'));
                this.setViewState('editName', x.get('name'));
            });
        }
    },

    render() {
        let file = this.getViewState(filePath.concat(this.getFileId()), emptyMap);
        let editText = this.getViewState('editText');
        let editName = this.getViewState('editName');

        let id = file.get('id');
        let records = file.get('records', emptyList);
        let recordMap = this.getViewState(recordPath, emptyList).reduce((a, b) => a.set(b.get('id'), b), emptyMap);
        let maxIndex = this.getViewState(recordPath, emptyList).reduce((a, b) => Math.max(a, b.get('id')), 0) + 1;


        return div({className: 'fm-content'},
            div({className: 'fm-file-view-content-header'},'Name:'),
            div({className: 'fm-file-view-content'},
                input({type: 'text', value: editName, onChange: this.onNameChange, onBlur: this.onNameBlur})
            ),

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
            }),
            div({className: 'fm-file-view-text'},
                textarea({value: editText, ref: 'textarea', className: 'fm-file-view-text-content', onChange: this.onTextChange})
            )
        );
    },

    onTextChange(e) {
        let text = e.target.value;
        this.setViewState('editText', text);

        let currentTime = new Date().getTime();
        this._debounceTime = new Date().getTime();
        setTimeout(() => {
            if (currentTime === this._debounceTime) {
                let file = this.getViewState(filePath.concat(this.getFileId()), emptyMap);

                file = file.set('content', text);
                files.actions.updateFile(file);
                records.actions.fetchRecords();
            }
        }, 1000);
    },

    onNameChange(e) {
        this.setViewState('editName', e.target.value);
    },

    onNameBlur(e) {
        let file = this.getViewState(filePath.concat(this.getFileId()), emptyMap);
        file = file.set('name', e.target.value);

        files.actions.updateFile(file);
    },

    getFileId(props) {
        return decodeURIComponent((props || this.props).params.fileId);
    }
});
