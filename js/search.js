function _search(cfg){
	
   // return a new _chat object if we're in the wrong scope (scope of window object)
   if (window === this) {
      return new _search(cfg);
   };
   
   if(cfg !== undefined){
		this.url = cfg.url === undefined ? 'http://127.0.0.1:8080' :  cfg.url;
		this.searchField = getNode(cfg.searchBox_id);
		this.msgField = getNode(cfg.msgField_id);
		this.saveBtn = getNode(cfg.saveBtn_id);
		this.status = getNode(cfg.statusDiv_id);
		this.searchFieldId = cfg.searchBox_id;
	}
   
	return this;
}
	
/* _search Prototype Functions
============================*/
function getNode(id){
	return document.getElementById(id);
};

_search.prototype = { 

	getSearchAutoFill : function(){
		//chat cfg objects
		var _searchBox = this.searchField,
			_searchFieldId = this.searchFieldId,
			_msgField = this.msgField,
			_saveBtn = this.saveBtn,
			_status = this.status;
		
		var statusDefault = this.status.textContent,
		    setStatus = function(s){	
					_status.textContent = s;
					if(s !== statusDefault){
						var delay = setTimeout(function(){
							setStatus(statusDefault);
							clearInterval(delay);
						},3000);
					}
			};
				
			try{	
				var socket = io.connect(this.url);
			}catch(e){
				_status.textContent = 'Unable to connect !'
			}
				
			if(socket !== undefined){
				//Listen for output
				socket.on('output',function(data){
					//new _chat().printChat(data,_chatBox);
					console.log(data);
					var availableTags = [];
					for(var i=0;i< data.length;i++){
						
						availableTags.push((data[i].message));
					}
					
					$( "#"+_searchFieldId).autocomplete({
						source: availableTags
					});
				});
				
				//Listen for status
				socket.on('status',function(data){
					setStatus(typeof data === 'object' ? data.message : data);
					if(data.saved === true){
						_msgField.value = '';
					}
				});
				
				//Listen for the search field type
				this.searchField.addEventListener('keydown',function(event){
					var self = this,
						text = _searchBox.value;
						socket.emit('search',{
							search_text: text
						});
				});
				
				//Listen for the enter key
				this.saveBtn.addEventListener('click',function(event){
					var self = this,
						msg = _msgField.value;
						if(msg){
							console.log(msg + ' emitted...');
							socket.emit('input',{
								message: msg
							});
						}
					
				});
			};
	}
   
};