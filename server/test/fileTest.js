import fileController from '../controllers/fileController';

let {writeFile, deleteFile, getFiles, getFile, mapFromDisk} = fileController;
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
    // console.l`og('records:\n', _getRecords().toJS());

		await mapFromDisk();

		console.log("writetest");
		let file = {
			name:"John Cena",
			content:"Joooohhhhnnn Cennaaaa"
		};
		await writeFile({id:1,data:file});
		console.log("writeTest finished");

		console.log("getFileTest");
		let newer = await getFile({id:1});
		console.log(newer);
		console.log("getFile test finished")

		console.log ("getFiles Test");
		let filler = await getFiles();
		console.log(filler);
		console.log("getFiles Test finished")

		console.log("delete");
		await deleteFile({id:1});
		console.log(await getFiles());
}
test();
