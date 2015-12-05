import immutable from 'immutable';
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

async function updateFile(file) {
    if (!file.get) {
        file = immutable.fromJS(file);
    }

    let payload = {data: {name: file.get('name'), content: file.get('content')}};
    let result = await rest.post(`${urls.files}/${file.get('id', '')}`, payload);
    store.cursor().set(result.id, result);

    return result;
}

async function deleteFile(id) {
    try {
        await rest.del(id);
        store.cursor().remove(id);

        return true;
    } catch (e) {
        return false;
    }
}

const actions = {
    fetchFiles: createAction(fetchFiles),
    fetchFile: createAction(fetchFile),
    updateFile: createAction(updateFile),
    deleteFile: createAction(deleteFile)
};

export default {
    actions,
    store: store.public
};
