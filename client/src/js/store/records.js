import {createAction, createStore} from 'flux';
import rest from '../rest';
import {urls} from 'constants';

const store = createStore();

async function fetchRecords() {
    let records = await rest.get(urls.records);
    store.cursor.update(_ => records);

    return records;
}

async function fetchRecord(id) {
    let record = await rest.get(urls.records);
    store.cursor.set(id, record);

    return record;
}

const actions = {
    fetchRecords: createAction(fetchRecords),
    fetchRecord: createAction(fetchRecord)
};

export default {
    actions,
    store: store.public
};
