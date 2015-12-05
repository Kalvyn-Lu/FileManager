import React from 'react';
const {div} = React.DOM;
import {emptyList, routeNames} from 'constants';
import component from 'component';
import files from '../store/files';

import {Link} from './router-jsx';

const filesPath = ['@@filesView/files'];

export default component({
    displayName: 'filesView',

    mixins: [files.store.connectTo([], filesPath)],

    componentDidMount() {
        files.actions.fetchFiles();
    },

    render() {
        let filesList = this.getViewState(filesPath, emptyList);

        return div({className: 'content'},'fsView',
            filesList.map(x => {
                
            })
        );
    }
});
