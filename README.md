nodejs ajax search
==================

Node js ajax search example
I have tried to bind everything in one js function _search 
This is primarily a self learning exercise.

Requires : jquery, Jquery_ui, nodejs, Mongodb
================================================

This can be used as below:

	__search({
				"searchBox_id" : "searchbox",
				"msgField_id" : "message",
				"saveBtn_id" : "submit_msg",
				"statusDiv_id" : "statusDiv",
				"url" : "http://127.0.0.1:8080"
			}).getSearchAutoFill();

STEPS
include js/search.js in your html
start nodejs server by command node js/node/server.js
NOTE: nodejs requires mongodb and socket.io module installed 
at js/node which can be done by 
1. npm install mongodb
2. npm install socket.io