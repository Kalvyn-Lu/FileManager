import React from 'react';
const {div,textarea,button} = React.DOM;
import {emptyMap, routeNames} from 'constants';
import component from 'component';
import files from '../store/files';

import {Link, Router} from './router-jsx';

const createFilePath = ['@@createFileView/createFile'];

export default component({
    displayName: 'createFileView',

    mixins: [files.store.connectTo([], createFilePath), Router.Navigation],

    componentDidMount() {
        files.actions.fetchFiles();
    },

    render() {
        console.log(this);
        let fileName = this.getViewState('fileName');
        let contents = this.getViewState('contents');

        return div({className: 'fm-content'},
                div({className: 'fm-create-file-item-name'}, 'File Name'),
                  textarea({value: fileName, ref: 'textarea', className: 'fm-create-file-name-text-content', onChange: this.onTextNameChange}),
                div({className: 'fm-create-file-item-contents'}, 'Contents of File'),
                  textarea({value: contents, ref: 'textarea', className: 'fm-create-file-content-text-content', onChange: this.onTextContentsChange}),
                button({ref: 'button', className: 'fm-create-file-button', onClick: this.onClickSave}, 'Create File'),
                );
    },

    onTextNameChange(e) {
        let textFileName = e.target.value;
        this.setViewState('fileName', textFileName);
    },

    onTextContentsChange(e) {
        let textFileContents = e.target.value;
        this.setViewState('contents', textFileContents);
    },

    onClickSave(e) {
        let file = emptyMap;
        let textFileName = this.getViewState('fileName');
        let textFileContents = this.getViewState('contents');

        file = file.set('name', textFileName);
        file = file.set('content', textFileContents);

        files.actions.updateFile(file).then(x => {
            this.transitionTo(routeNames.file, {fileId: x.get('id')});
        });
    }
});
