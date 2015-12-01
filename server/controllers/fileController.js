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


async function getFiles() {
	let fileArr = [];
	for (let item of files){
		fileArr.push(item);
	}
	return fileArr;
	//return Promise.resolve({msg: 'we got some files!'});
}

async function getFile({id}) {
	return files.get(id);
	//return Promise.resolve({msg: `we got a file! ${id}`});
}

async function writeFile({id, data}) {
 	let create = new File(id);
	create.name = data.name;
	let strData = data.content;

	for(let i = 0; i < strData.length; i+= recordSize){
		let cSlice;
		if(strData.length < (i + recordSize)){
			cSlice = strData.slice(i,strData.length);
		}else{
			cSlice = strData.slice(i,recordSize);
		}
		create.records.push(recordController.writeRecord({data:cSlice}));
	}
	console.log(create.name);
	console.log(data.content);
	files = files.set(id,create);;
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
