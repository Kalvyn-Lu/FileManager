import React from 'react';
const {div, h4} = React.DOM;
import Router from './router-jsx';
import component from 'component';
import files from '../store/files';
import {emptyMap, emptyList} from 'constants';

const filePath = ['@@filesView/file'];

export default component({
    displayName: 'Shell',

    mixins: [
        Router.State,
        Router.Navigation,
        files.store.connectTo([], filePath)
    ],

    componentDidMount() {
        files.actions.fetchFile(this.getFileId());
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

        return div({className: 'fm-content'},
            div({className: 'fm-file-view-content-header'},'Name:'),
            div({className: 'fm-file-view-content'},name),

            div({className: 'fm-file-view-content-header'},'ID'),
            div({className: 'fm-file-view-content'}, id),

            div({className: 'fm-file-view-content-header'}, 'Record Numbers:'),
            records.map(x => {
                return div({className: 'fm-file-view-content'}, x)
            })
        );
    },

    getFileId(props) {
        return decodeURIComponent((props || this.props).params.fileId);
    }
});
