import uuid from 'tiny-uuid';
import immutable from 'immutable';
import promisify from 'es6-promisify';
import fs from 'fs';
import LRUCache from '../vendor/LRUCache';

const cacheSize = 1000;
const dir = '../tmp';
const recordTableFile = 'RecordTable.json';
const ext = 'rec';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

let records = immutable.Map();
let cache = new LRUCache(cacheSize);
tableFromDisk();

class Record {
    constructor(id, data) {
        this.id = id !== undefined ? id : getNextId();
        this.size = data === undefined ? 0 : data.length;
        this.buffer = data || null;
    }

    toString() {
        return JSON.stringify(this);
    }
}

async function persistToDisk() {
    let shortRecords = await getRecords();
    let recordsJson = JSON.stringify(shortRecords.toJS());

    fs.writeFile(`${dir}/${recordTableFile}`, recordsJson, function(err) {
        if (err) {
            console.log("Cannot persist to Disk");
        } else {
            console.log("It's Saved!");
        }
    });
}

async function tableFromDisk() {
    try {
        let data = await promisify(fs.readFile)(`${dir}/${recordTableFile}`);
        let parsed = JSON.parse(data);

        records = immutable.Map(parsed).mapEntries(([k, v]) => [Number(k), v]);
    } catch (err) {
        console.error('Failed to load record table from disc');
    }
}

// Reads data from the disc, and assigns it to the given record
async function readFromDisc(record) {
    // if the record doesn't exist, we need to wtf out
    if (!record || record.id === undefined) {
        throw new Error('readFromDisc: Cant fill record that is null, or has no id');
    }

    // If the record already has information in it
    if (record.buffer) {
        return record;
    }

    try {
        record.buffer = await promisify(fs.readFile)(`${dir}/${record.id}.${ext}`);
    } catch (e) {
        console.log('ERROR: ', e);
        throw new Error(`readFromDisc: Error reading from disc for record ${record.id}`);
    }

    return record;
}

// Writes data to disc, to a location dependant on the given record
function writeToDisc(record, data) {
    // if the record doesn't exist, we need to wtf out
    if (!record || record.id === undefined) {
        throw new Error('readFromDisc: Cant fill record that is null, or has no id');
    }

    try {
        return promisify(fs.writeFile)(`${dir}/${record.id}.${ext}`, data);
    } catch (e) {
        console.log('ERROR: ', e);
        throw new Error(`writeToDisc: Error writing to disc for record ${record.id}`);
    }
    persistToDisk();
}

// Clears the file specified by the given id
function clearFile(id) {
    if (id === undefined) {
        throw new Error('clearFile: id not specified');
    }
    persistToDisk();
    return promisify(fs.unlink)(`${dir}/${id}.${ext}`);
}

// Returns the first free id in the record table
function getNextId() {
    let index = 0;

    // Keep scrolling through the record table until we find a hole, or reach the end
    while (records.get(index) !== undefined) {
        index++;
    }

    return index;
}

// Manages our cache of records, whose file buffer is loaded into memory
function bumpCache(record) {
    let evicted = cache.set(record.id, record);
    if (evicted && evicted.id !== record.id) {
        evicted.buffer = null;
    }
}

// Returns a list of all of the record objects, without any buffer information
async function getRecords() {
    return records.map(x => ({id: x.id, size: x.size}));
}

// Returns a full record object
async function getRecord({id}) {
    let record = await readFromDisc(records.get(id));
    bumpCache(record);

    return record;
}

// Writes a record to the table, leaving 'id' null creates a new record
async function writeRecord({id, data}) {
    let record = new Record(id, data);
    writeToDisc(record, data);
    bumpCache(record);
    records = records.set(record.id, record);
    persistToDisk();
    return record;
}

// Deletes the specified record from the table
async function deleteRecord({id}) {
    records = records.remove(id);
    cache.remove(id);
    clearFile(id);
    persistToDisk();
    return true;
}

export default {
    _getRecords: () => records,
    cache,

    getRecords,
    getRecord,
    writeRecord,
    deleteRecord
};
