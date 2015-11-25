import uuid from 'tiny-uuid';
import immutable from 'immutable';

const recordSize = 1024;
const cacheSize = 100;

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

    fillRecordBuffer(record) {
        
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
