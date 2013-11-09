
var twilioClient = require('twilio')('ACcf46cc45dfc6c558215e76d503ee76de','ebdfcae31d9493e4859d3b80c2b2672b');
exports.text = function(request,response){
	console.log(request.body.Body);
	twilioClient.sendMessage({
		to: request.body.From,
		from: '+17209614567', 
		body: 'Welcome to GimmeShelter! To get started, enter your current address.'
	}, function(err, responseData) { 
		console.log(err);
		if (!err) { 
    	console.log(responseData.from);
    	console.log(responseData.body);
		}
	});
		

}