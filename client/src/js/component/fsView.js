import React from 'react';
const {div, button} = React.DOM;
import {emptyList, routeNames} from 'constants';
import component from 'component';
import files from '../store/files';

import {Link} from './router-jsx';

import ReactDropzoneClass from 'react-dropzone';
const ReactDropzone = React.createFactory(ReactDropzoneClass);

const filesPath = ['@@filesView/files'];

export default component({
    displayName: 'filesView',

    mixins: [files.store.connectTo([], filesPath)],

    componentDidMount() {
        files.actions.fetchFiles();
    },

    render() {
        let filesList = this.getViewState(filesPath, emptyList).toList();

        return div({className: 'fm-content'},
            div({className: 'fm-narrow-content'},
                ReactDropzone({className: 'fm-file-upload', onDrop: this.onDrop},
                    div({className: 'fm-file-upload-msg'}, 'Click or drag a file to upload!')
                ),
                div({className: 'fm-file-list'},
                    div({className: 'fm-file-item-header'},
                        div({className: 'fm-file-item-id'}, 'ID'),
                        div({className: 'fm-file-item-name'}, 'Name'),
                        div({className: 'fm-file-size'}, 'Size'),
                        div({className: 'fm-file-delete'})
                    )
                ),
                filesList.map(x => {
                    return Link({className: 'fm-file-item', to: routeNames.file, params: {fileId: x.get('id')}},
                        div({className: 'fm-file-item-id'}, x.get('id')),
                        div({className: 'fm-file-item-name'}, x.get('name')),
                        div({className: 'fm-file-size'}, x.get('size')),
                        div({className: 'fm-file-delete'}, button({onClick: this.onDelete(x)}, 'x'))
                    );
                })
            )
        );
    },

    onDrop(uploadFiles) {
        uploadFiles.forEach(file => {
            let reader = new FileReader();
            reader.onload = (evt) => {
                let content = evt.target.result;
                let name = file.name;

                files.actions.updateFile({content, name});
            };

            reader.readAsBinaryString(file);
        });
    },

    onDelete(file) {
        return e => {
            console.log('click');
            e.stopPropagation();
            e.preventDefault();
            files.actions.deleteFile(file.get('id'));
        };
    }
});
