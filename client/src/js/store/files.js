import {createAction, createStore} from 'flux';
import rest from '../rest';
import {urls} from 'constants';

const store = createStore();

async function fetchFiles() {
    let files = await rest.get(urls.files);
    store.cursor().update(x => x.merge(files));

    return files;
}

async function fetchFile(id) {
    let file = await rest.get(`${urls.files}/${id}`);
    store.cursor().set(id, file);

    return file;
}

const actions = {
    fetchFiles: createAction(fetchFiles),
    fetchFile: createAction(fetchFile)
};

export default {
    actions,
    store: store.public
};
