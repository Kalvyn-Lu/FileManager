import uuid from 'tiny-uuid';
import immutable from 'immutable';
import promisify from 'promisify-node';
import fs from 'fs';

const recordSize = 1024;
const cacheSize = 100;
const dir = './tmp';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

class RecordTable {
    constructor(json) {
        this.nextId = 0;
        this.records = immutable.Map();
    }

    requestId() {
        let index = this.nextId;

        // Keep scrolling through the record table until we find a hole, or reach the end
        while (this.records.get(index) !== undefined) {
            index++;
        }

        return index;
    }

    async fillRecordBuffer(record) {
        // if the record doesn't exist, we need to wtf out
        if (!record || record.id === undefined) {
            throw new Error('fillRecordBuffer: Cant fill record that is null, or has no id');
        }

        // If the record already has information in it
        if (record.buffer) {
            return;
        }

        record.buffer = await promisify(fs.readFile(`${dir}/${record.id}`));
    }
}

class Record {
    constructor(id) {
        this.id = id;
        this.buffer = null;
    }
}

// Returns a list of all of the record objects, without any buffer information
function getRecords() {
    return Promise.resolve({msg: 'we got some Records!'});
}

// Returns a full record object
function getRecord({id}) {
    return Promise.resolve({msg: `we got a Record! ${id}`});
}

// Writes a record to the table, leaving 'id' null creates a new record
function writeRecord({id, data}) {
    return Promise.resolve({msg: `we are updating a Record! ${id}`});
}

// Deletes the specified record from the table
function deleteRecord({id}) {
    return Promise.resolve({msg: `we are deleting a Record! ${id}`});
}

export default {
    getRecords,
    getRecord,
    writeRecord,
    deleteRecord
};
