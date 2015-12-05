import React from 'react';
const {div, h4} = React.DOM;
import Router from './router-jsx';
import component from 'component';
import records from '../store/records';
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
        files.actions.fetchfile(this.getFileId());
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.params.fileId !== nextProps.params.fileId) {
            files.actions.fetchFile(this.getFileId(nextProps));
        }
    },

    render() {
        let file = this.getViewState(filePath.concat(this.getFileId()), emptyMap);
        console.log(file);

        return div({className: 'fm-content'}
            
        );
    },

    getRecordId(props) {
        return Number(decodeURIComponent((props || this.props).params.recordId));
    }
});
