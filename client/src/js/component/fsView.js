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
        return div({className: 'fm-content'},
            div({className: 'fm-file-list'},
                div({className:'fm-file-item-header'},
                    div({className: 'fm-file-item-id'}, 'ID'),
                    div({className: 'fm-file-item-name'}, 'Name'),
                    div({className: 'fm-file-size'}, 'Size')
                )
            ),
            filesList.map(x => {
                div({})
            })
        );
    }
});
