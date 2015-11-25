
function getRecords() {
	return Promise.resolve({msg: 'we got some Records!'});
}

function getRecord({id}) {
	return Promise.resolve({msg: `we got a Record! ${id}`});
}

function writeRecord({id, data}) {
	return Promise.resolve({msg: `we are updating a Record! ${id}`});
}

function deleteRecord({id}) {
	return Promise.resolve({msg: `we are deleting a Record! ${id}`});
}

export default {
	getRecords,
	getRecord,
	writeRecord,
	deleteRecord
};
