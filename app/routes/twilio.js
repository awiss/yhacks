
var twilioClient = require('twilio')('ACcf46cc45dfc6c558215e76d503ee76de','ebdfcae31d9493e4859d3b80c2b2672b');
exports.text = function(request,response){
	process.redis.client.get('request.body.From',function(err,value){
		console.log(request.body.Body);
		if(value){
			if(!value.address){
				var obj = value;
				obj.address=request.body.Body;
				process.redis.client.set(request.body.From,obj,redis.print);
				twilioClient.sendMessage({
					to: request.body.From,
					from: '+17209614567', 
					body: 'Thanks for your address!'
				}, function(err, responseData) { 
					console.log(err);
				});
			}
		} else {
			twilioClient.sendMessage({
				to: request.body.From,
				from: '+17209614567', 
				body: 'Welcome to GimmeShelter! To get started, enter your current address.'
			}, function(err, responseData) { 
				console.log(err);
				if (!err) { 
					process.redis.client.set(request.body.From,{weather:true,address:null},redis.print);
		    	console.log(responseData.from);
		    	console.log(responseData.body);
				}
			});
		}
		
		
	});

}