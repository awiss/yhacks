var gm = require('googlemaps');
var twilioClient = require('twilio')('ACcf46cc45dfc6c558215e76d503ee76de','ebdfcae31d9493e4859d3b80c2b2672b');
exports.text = function(request,response) {
	console.log('Post to /twilio');
	console.log(request.body.From);
	process.redis.client.hgetall(request.body.From,function(err,value){
		console.log(err);
		console.log(value);
		if(value){
			if(value.results){
				var resultsArr = JSON.parse(value.results);
				var index = parseInt(request.body.Body);
				if(index>0 && index<=results.length){
					var result = resultsArr[index-1];
				}
				value.address=result.formatted_address;
				value.latitude = result.geometry.location.lat.toString();
				value.longitude = result.geometry.location.lng.toString();
				value.results = undefined;
				process.redis.client.hmset(request.body.From,value,function(err){
					console.log("REDIS:"+err);
				});
				twilioClient.sendMessage({
					to: request.body.From,
					from: '+17209614567', 
					body: 'Thanks! Your address was stored as' + value.address
				}, function(err, responseData) { 
					//console.log(err);
				});
			}
			
			console.log(value.address);
			if(!value.address){
				gm.geocode(request.body.Body,function(err,response){
					console.log(JSON.stringify(response.results));

					if(response.results.length==0){
						twilioClient.sendMessage({
						to: request.body.From,
						from: '+17209614567', 
						body: 'Sorry, we couldn\'t find that address. Please try again'	
						}, function(err, responseData) { 
							//console.log(err);
						});
					} else if (response.results.length==1){
						/* One Geocode Result - Normal Case */
						value.address=response.results[0].formatted_address;
						value.latitude = response.results[0].geometry.location.lat.toString();
						value.longitude = response.results[0].geometry.location.lng.toString();
						
						process.redis.client.hmset(request.body.From,value,function(err){
							console.log("REDIS:"+err);
						});

						twilioClient.sendMessage({
							to: request.body.From,
							from: '+17209614567', 
							body: 'Thanks! Your address was stored as ' + value.address
						}, function(err, responseData) { 
							//console.log(err);
						});

					} else {
						/* Multiple Geocode Results - Need to ask them */
						value.results = JSON.stringify(response.results);
						process.redis.client.hmset(request.body.From,value,function(err){
							var body = "We\'re not sure which address you mean. Which one of these is it? Text the number next to the correct address."
							for(var i=0;i<response.results.length;i++){
								console.log(response.results[i].formatted_address);
								body +=" " + (i+1) + ". " + response.results[i].formatted_address;
							}
							twilioClient.sendMessage({
								to: request.body.From,
						  	from: '+17209614567', 
								body: body
							}, function(err, responseData) { 
								//console.log(err);
							});
						});		
					}
				});
				
			} else {
				console.log("has address");
			}
		} 
		else {
			twilioClient.sendMessage({
				to: request.body.From,
				from: '+17209614567', 
				body: 'Welcome to GimmeShelter! To get started, enter your current address.'
			}, function(err, responseData) { 
				//console.log(err);
				if (!err) { 
					process.redis.client.hmset(request.body.From,{"weather":"true"});
		    	// console.log(responseData.from);
		    	// console.log(responseData.body);
				}
			});
		}
		
		function help() {
			twilioClient.sendMessage({
				to: request.body.From,
				from: '+17209614567',
				body: "Text FOOD for directions to the nearest soup kitchen.\nText ROOM for directions to the nearest shelter.\nText GIVE ME SHELTER to subscribe to severe weather alerts.\nText STOP WEATHER to unsubscribe from severe weather alerts."
			}, function(err, responseData) {
				//console.log(err);
			});
		}
	});
}
