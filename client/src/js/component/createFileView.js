import React from 'react';
const {div,textarea,button} = React.DOM;
import {emptyList, routeNames} from 'constants';
import component from 'component';
import files from '../store/files';

import {Link} from './router-jsx';

const createFilePath = ['@@createFileView/createFile'];

export default component({
    displayName: 'createFileView',

    mixins: [files.store.connectTo([], createFilePath)],

    componentDidMount() {
        files.actions.fetchFiles();
    },

    render() {
        // let filesList = this.getViewState(createFilePath, emptyList).toList();
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
      let file = this.getViewState(emptyMap);

      file = file.set('name', textFileName);
      file = file.set('content', textFileContents);

      files.actions.updateFile(file);

      Link({to: routeNames.fileList});
    }
});
