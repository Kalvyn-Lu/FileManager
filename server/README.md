#Key Lemon SDK Web Service

A simple web server to wrap the functionallity offered by KeyLemon

## Quickstart

`npm install`
`npm run start`

## Contents

* /controllers - Middle layer for managing interop between API, KeyLemon, and the DB
* /credentials - Put all of your credentials here!
* /db - Wrapper for persisting objects
* /keyLemonWrapper - Layer for wrapping the KeyLemon SDK in javascript
* /routes - Route files for handling API requests
* /test - Test files for utility functions, etc
* /utils - Utility functions for aiding in data processing and keeping things DRY
* /vendor - non-npm managed libraries go here
* README.md - this file
* app.js - central app file for the project
* constants.js - Constants for the app!
* package.json - package info for the project
* polyfills.js - Put all polyfills for general functions here (this file is purely side affecting)

## Credentials

There are a set of credentials you need to create in order for the app to successfully operate. This will include creating server certs, or pasting them from somewhere else.

	- aws.js
		`export default {
		    accessKeyId: 'xxxx',
		    secretAccessKey: 'xxxx'
		};`
	- db.js
		`export default {
			database: 'keylemon',
			username: 'root',
			password: 'xxx',
			host: 'xxx.rds.amazonaws.com'
		};`
	- site.cert
	- site.key

## Environment Setup/Server Provisioning

	- This won't run fully on OSX/linux. Sorry :( the keylemon SDK is compiled for windows and they cant/wont compile for another platform.
	- Ensure that ImageMagick (http://www.imagemagick.org/script/binary-releases.php) is installed, and added to the path. The command `convert.exe` should resolve correctly to it.
	- Ensure that the S3 bucket `keylemonservice` is created correctly
	- Ensure that the DB you specify in your db credentials is created. Sequelize will generate the tables.
	- Install c++ redistributables (https://www.microsoft.com/en-us/download/details.aspx?id=48145)

## Creating or editing KeyLemon Procedures

	In the SDK folders, are projects setup for each of the routines. The projects are setup to use Visual Studio to build them. You MUST compile them in release mode, or else the
	deployed server won't be able to run them. To create a new routine you must:
		- Create a new project, easiest to simply copy one so the sdk references are already setup
		- Build and copy your artifact to the directory you want to use it in
		- Write a javascript wrapper around it, that calls into it

## Known issues
	- Error handling is awful right now. Debugging is a pretty big pain right now, and some easy universal wrapper around it that just prints stack traces would be pretty big step up
	- Logging would be good.
	- Credential handling is annoying. Setting up a new local instance can be painful at times.
	- Default run mode for other OS' would be nice so you don't have to dev on windows. Maybe just mock all the KL wrapper calls?
