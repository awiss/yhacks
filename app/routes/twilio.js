
//var twilioClient = require('twilio')('ACcf46cc45dfc6c558215e76d503ee76de','ebdfcae31d9493e4859d3b80c2b2672b');
exports.text = function(request,response){
	twilioClient.sendMessage({
		to: request.body.from,
		from: '+17209614567', 
		body: 'Welcome to GimmeShelter! To get started, enter your current address.'
	}, function(err, responseData) { 
		if (!err) { 
    	console.log(responseData.from);
    	console.log(responseData.body);
		}
	});
		

}