import uuid from 'tiny-uuid';
import immutable from 'immutable';
import recordController from './recordController'

let files = immutable.Map();
class File {
	constructor() {
		this.name = '';
		this.id = uuid();
		this.records = []; // list of record ids
	}
}

function getFiles() {
	return Promise.resolve({msg: 'we got some files!'});
}

function getFile({id}) {
	return Promise.resolve({msg: `we got a file! ${id}`});
}

function writeFile({id, data}) {
	File create = new File();
	create.name = data.name;
	create.id = id;
	Math.floor()
	return Promise.resolve({msg: `we are updating a file! ${id}`});
}

function deleteFile({id}) {
	return Promise.resolve({msg: `we are deleting a file! ${id}`});
}

export default {
	getFiles,
	getFile,
	writeFile,
	deleteFile
};
