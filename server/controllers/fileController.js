import uuid from 'tiny-uuid';
import immutable from 'immutable';
import recordController from './recordController'

let files = immutable.Map();

const recordSize = 1024;

class File {
    constructor(id) {
        this.name = '';
        this.id = id !== undefined ? id : uuid();
        this.records = immutable.List();
        this.size = 0;
    }
}

async function getFiles() {
    return files.values();
}

async function getFile({id}) {
    return files.get(id);
}

async function writeFile({id, data}) {
    let create = files.get(id, new File(id));
    create.name = data.name;
    let strData = data.content;

    let currentRecords = create.records;
    let neededRecords = Math.floor(strData.length / recordSize);

    // Create or update records based on the new content
    for (let i = 0; i < neededRecords; i++) {
        let recordId = currentRecords.getIn([i, 'id']);
        let slice = strData.slice(i * recordSize, (i + 1) * recordSize);

        let createdRecord = await recordController.writeRecord({id: recordId, data: slice});
        create.records = create.records.concat(createdRecord);
    }

    // Deallocate unneeded records
    currentRecords.slice(neededRecords + 1).forEach(x => recordController.deleteRecord({id: x.id}));

    // Assign our new/updated file to the file table
    files = files.set(id, create);

    return Promise.resolve({msg: `we are updating a file! ${id}`});
}

async function deleteFile({id}) {
    let toDel = files.get(id);
    for(let rNum of toDel.records){
        recordController.deleteRecord({id:rNum});
    }
    files = files.delete(id);
  return Promise.resolve({msg: `we are deleting a file! ${id}`});
}

export default {
    getFiles,
    getFile,
    writeFile,
    deleteFile
};
