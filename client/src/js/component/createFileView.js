import React from 'react';
const {div,textarea,button} = React.DOM;
import {emptyList, routeNames} from 'constants';
import component from 'component';
import files from '../store/files';

import {Link} from './router-jsx';

import ReactDropzoneClass from 'react-dropzone';
const ReactDropzone = React.createFactory(ReactDropzoneClass);

const createFilePath = ['@@createFileView/createFile'];

export default component({
    displayName: 'createFileView',

    mixins: [files.store.connectTo([], createFilePath)],

    componentDidMount() {
        files.actions.fetchFiles();
    },

    render() {
        // let filesList = this.getViewState(createFilePath, emptyList).toList();
        let editText = this.getViewState('Contents of Created File');

        return div({className: 'fm-content'},
                div({className: 'fm-create-file-item-name'}, 'File Name'),
                  textarea({value: '', ref: 'textarea', className: 'fm-create-file-name-text-content', onChange: this.onTextNameChange}),
                div({className: 'fm-create-file-item-contents'}, 'Contents of File'),
                  textarea({value: editText, ref:'textarea', className: 'fm-create-file-content-text-content', onChange: this.onTextContentsChange}),
                button({value: 'Create File', ref: 'button', className: 'fm-create-file-button'}),
                );
    },

    onTextChange(e) {
      let text = e.target.value;
      this.setViewState('Contents of Created File');
    }
});
