import uuid from 'tiny-uuid';
import immutable from 'immutable';
import recordController from './recordController'

let files = immutable.Map();

const recordSize = 1024;

class File {
	constructor(id) {
		this.name = '';
		this.id = id !== undefined ? id:uuid();
		this.records = []; // list of record ids
		this.size = 0;
	}
}


function getFiles() {

	return Promise.resolve({msg: 'we got some files!'});
}

function getFile({id}) {

	return Promise.resolve({msg: `we got a file! ${id}`});
}

function writeFile({id, data}) {
 	let create = new File(id);
	create.name = data.name;
	let strData = data.content;
	for(let i = 0; i < strData.length; i+= recordSize){
		let cSlice;
		if(strData.length < (i + recordSize)){
			cSlice = strData.slice(i,strData.length);
		}else {
			cSlice = strData.slice(i,recordSize);
		}
		create.records.append(recordController.writeRecord({id:null,data:cSlice}));
	}
	files = files.set(id,create);
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
