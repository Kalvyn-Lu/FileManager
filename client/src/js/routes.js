import Shell from './component/Shell';
import {routeNames} from 'constants';

import {Router, Route, DefaultRoute, RouteHandler, Redirect} from './component/router-jsx';
import fsView from './component/fsView';
import fileView from './component/fileView';
import recordsView from './component/recordsView';
import recordView from './component/recordView';
import createFileView from './component/createFileView';

// Configure routes
// react-router expects JSX-compatible elements for its handlers
const routes =
    Route({handler: Shell.jsx},
        Redirect({from: '/', to: routeNames.files}),
        Route({name: routeNames.files, handler: RouteHandler.jsx},
            DefaultRoute({name: routeNames.fileList, handler: fsView.jsx}),
            Route({name: routeNames.file, path: ':fileId', handler: fileView.jsx})
        ),
        Route({name: routeNames.records, handler: RouteHandler.jsx},
            DefaultRoute({name: routeNames.recordList, handler: recordsView.jsx}),
            Route({name: routeNames.record, path: ':recordId', handler: recordView.jsx})
        ),
        Route({name: routeNames.createFile, handler: RouteHandler.jsx})
    );

export function runRouter(callback) {
    Router.run(routes, Router.HistoryLocation, callback);
}
