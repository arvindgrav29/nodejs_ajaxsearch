console.log("server listening 8080");

var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets;
	
mongo.connect('mongodb://127.0.0.1/autosearch',function(err,db){
	if(err)
		throw err;
	client.on('connection',function(socket){
		
		var col = db.collection('messages'),
			sendStatus  =function(s){
				socket.emit('status',s);
			};
			
		//search query for all messages
		socket.on('search',function(data){
			if(data.search_text){
				console.log(data.search_text);
				var query = { message: new RegExp(data.search_text)};
				col.find(query,{ _id: 0 }).limit(10).sort({message:1}).toArray(function(err,res){
					if(err) throw err;
					socket.emit('output',res);
				});
			}
		});
		
		//wait for input to save message
		socket.on('input',function(data){
			console.log(data);
			var message = data.message;
			
			//do not enter empty messages.. the page could be hacked
			var whiteSpacePattern = /^\s*$/;
			if(whiteSpacePattern.test(message)){
				sendStatus('message is required.');
			}
			else{
				col.insert({message:message},function(){
					sendStatus({
						message:"Message saved",
						saved:true
					})
				});
			}
		});
			
	});
});
