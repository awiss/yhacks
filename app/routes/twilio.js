

exports.text = function(request,response){
	client.get(request.body.from,function(err,value){
		if(value){

		}	else {
			twilioClient.sendMessage({
    		to: request.body.from
    		from: '+17209614567', 
    		body: 'Welcome to GimmeShelter! To get started, enter your current address.'
			}, function(err, responseData) { 
				if (!err) { 
        	console.log(responseData.from);
        	console.log(responseData.body);
    		}
			});
		}
	});
}