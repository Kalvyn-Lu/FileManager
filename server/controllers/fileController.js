import uuid from 'tiny-uuid';
import immutable from 'immutable';
import fs from 'fs';
import promisify from 'es6-promisify';
import recordController from './recordController';

const recordSize = 1024;
const dir = '../tmp';
const fileMap = 'FileMap.json';

let files = immutable.Map();
mapFromDisk();

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

function newFile(id) {
    return immutable.fromJS({
        name: '',
        id: id !== undefined ? id : uuid(),
        records: immutable.List(),
        size: 0
    });
}

async function persistToDiskFile() {
  let shortFiles = await getFiles();
  let filesJson = JSON.stringify(shortFiles.toJS());

  fs.writeFile(`${dir}/${fileMap}`, filesJson, function(err) {
      if (err) {
          console.log("File map cannot persist to Disk");
      } else {
          console.log("File Map Saved!");
      }
  });
}

async function mapFromDisk() {
    try {
        let data = await promisify(fs.readFile)(`${dir}/${fileMap}`);
        let parsed = JSON.parse(data);

        files = immutable.fromJS(parsed);
    } catch (err) {
        console.error('Failed to load file map from disc');
    }
}

async function getFiles() {
    return files;
}

async function getFile({id}) {
    let file = files.get(id);
    if (!file) {
        return null;
    }

    let records = file.get('records');
    let content = '';
    for (let i = 0; i < records.size; i++) {
        let record = await recordController.getRecord({id: records.get(i)});
        content = content.concat(record.buffer.toString());
    }
    file = file.set('content', content);

    return file;
}

async function writeFile({id, data}) {
    let {name, content} = data;
    let file = files.get(id, newFile(id));
    file = file.set('name', name).set('size', content.length);

    let currentRecords = file.get('records');
    let neededRecords = Math.floor(content.length / recordSize) + 1;
    file = file.set('records', immutable.List());

    // Create or update records based on the new content
    for (let i = 0; i < neededRecords; i++) {
        let recordId = currentRecords.get(i);
        let slice = content.slice(i * recordSize, (i + 1) * recordSize);
        let createdRecord = await recordController.writeRecord({id: recordId, data: slice});

        file = file.update('records', x => x.concat(createdRecord.id));
    }

    // Deallocate unneeded records
    currentRecords.slice(neededRecords).forEach(recordId => recordController.deleteRecord({id: recordId}));

    // Assign our new/updated file to the file table
    files = files.set(file.get('id'), file);

    // Update persist file for file map
    persistToDiskFile();

    return file;
}

async function deleteFile({id}) {
    files.getIn([id, 'records'], immutable.List()).forEach(id => recordController.deleteRecord({id}));
    files = files.delete(id);

    // Update persist file for file map
    persistToDiskFile();

    return true;
}

export default {
    getFiles,
    getFile,
    writeFile,
    deleteFile
};
