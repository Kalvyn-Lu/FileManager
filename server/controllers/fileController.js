import uuid from 'tiny-uuid';
import immutable from 'immutable';
import fs from 'fs';
import promisify from 'es6-promisify';
import recordController from './recordController';

let files = immutable.Map();

const recordSize = 1024;
const dir = '../tmp';
const fileMap = 'FileMap.json';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

mapFromDisk();

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

  // console.log(filesJson);

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

        files = immutable.Map(parsed).mapEntries(([k, v]) => [Number(k), v]);
    } catch (err) {
        console.error('Failed to load file map from disc');
    }
}

async function getFiles() {
    return files;
}

async function getFile({id}) {
    return files.get(id);
}

async function writeFile({id, data}) {
    let {name, content} = data;
    let file = files.get([id, 'id'], newFile(id));
    file = file.set('name', name);

    let newRecords = immutable.List();
    let currentRecords = file.get('records');
    let neededRecords = Math.floor(content.length / recordSize);

    // Create or update records based on the new content
    for (let i = 0; i < neededRecords; i++) {
        let recordId = currentRecords.get(i);
        let slice = content.slice(i * recordSize, (i + 1) * recordSize);

        let createdRecord = await recordController.writeRecord({id: recordId, data: slice});
        newRecords = newRecords.concat(createdRecord.id);
    }
    file.records = newRecords;

    // Deallocate unneeded records
    currentRecords.slice(neededRecords + 1).forEach(x => recordController.deleteRecord({id: x.get('id')}));

    // Assign our new/updated file to the file table
    files = files.set(id, file);

    // Update persist file for file map
    persistToDiskFile();

    return getFile({id});
}

async function deleteFile({id}) {
    files.getIn([id, 'records']).forEach(x => recordController.deleteRecord({id: x.get('id')}));
    files = files.delete(id);

    console.log(files);
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
