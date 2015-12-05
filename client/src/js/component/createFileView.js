import React from 'react';
const {div} = React.DOM;
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

        return div();
    },
});
