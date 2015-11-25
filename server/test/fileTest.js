import fileController from '../controllers/fileController';

let {writeFile, deleteFile, getFiles, getFile} = fileController;
async function test() {
	console.log('file test running');
    // console.log('writing record 1');
    // await writeRecord({data: 'asdf'});

    // console.log('writing record 2');
    // await writeRecord({data: 'asdf'});

    // console.log('writing record 3');
    // await writeRecord({data: 'asdf'});

    // console.log('writing record 4');
    // await writeRecord({data: 'asdf'});

    // console.log('writing record 5');
    // await writeRecord({data: 'asdf'});

    // console.log('deleting record 1');
    // await deleteRecord({id: 1});

    // console.log('adjusting record 3');
    // await writeRecord({id: 3, data: 'qweradsf'});

    // let abbvRecord = await getRecords();
    // let fullRecord = await getRecord({id: 3});

    // console.log('LRU cache:', cache.toString());
    // console.log('getRecord:\n', fullRecord);
    // console.log('getRecords:\n', abbvRecord.toJS());
    // console.log('records:\n', _getRecords().toJS());
}
test();
