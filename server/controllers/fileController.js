
function getFiles() {
	return Promise.resolve({msg: 'we got some files!'});
}

function getFile(id) {
	return Promise.resolve({msg: 'we got a file!'});
}

function writeFile(id, data) {

}

function deleteFile(id) {

}

export default {
	getFiles,
	getFile,
	writeFile,
	deleteFile
};
