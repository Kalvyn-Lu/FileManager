import React from 'react';
const {div, textarea, input} = React.DOM;
import Router from './router-jsx';
import component from 'component';
import files from '../store/files';
import {emptyMap, emptyList} from 'constants';
import autosize from 'autosize';

const filePath = ['@@filesView/file'];

export default component({
    displayName: 'Shell',

    mixins: [
        Router.State,
        Router.Navigation,
        files.store.connectTo([], filePath)
    ],

    getInitialState() {
        return {
            editText: '',
            editName: ''
        };
    },

    componentDidMount() {
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

        return div({className: 'fm-content'},
            div({className: 'fm-file-view-content-header'},'Name:'),
            div({className: 'fm-file-view-content'},
                input({type: 'text', value: editName, onChange: this.onNameChange, onBlur: this.onNameBlur})
            ),

            div({className: 'fm-file-view-content-header'},'ID'),
            div({className: 'fm-file-view-content'}, id),

            div({className: 'fm-file-view-content-header'}, 'Record Numbers:'),
            records.map(x => {
                return div({className: 'fm-file-view-content'}, x);
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
