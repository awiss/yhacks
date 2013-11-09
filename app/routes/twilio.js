var gm = require('googlemaps');
var kitchens = require('./get_kitchens');
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
			if(!value.address || value.updateAddress || value.updateAddress=="true"){
				value.updateAddress=undefined;
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
				if(!value.latitude || !value.longitude){
					value.address=undefined;
					process.redis.client.hmset(request.body.From,value,function(err){});
					twilioClient.sendMessage({
						to: request.body.From,
						from: '+17209614567',
						body: 'Sorry, we are missing some info. Text us your address to fix this.'
					}, function(err, responseData) {
									//console.log(err);
								});
				}
				if(request.body.Body == "Food") {
					kitchens.getKitchens(value.latitude,value.longitude,function(err,body){
						var obj = JSON.parse(body);
						var text = "";
						var length = Math.max(obj.results.length,5);
						for(var i=0; i<length; i++){
							text+= "" + (i+1) + ". " + obj.results[i].name + "- Address: "+obj.results[i].formatted_address+"\n";
						}
						var resultCache = results.slice(0,5);
						value.resultCache=resultCache;
						process.redis.client.hmset(request.body.From,value,function(err){});
						twilioClient.sendMessage({
							to: request.body.From,
							from: '+17209614567',
							body: text
						}, function(err, responseData) {

						});
					});
					// soup kitchen call
				} else if(request.body.Body == "Room") {
					kitchens.getShelters(value.latitude,value.longitude,function(err,body){
						var obj = JSON.parse(body);
						var text = "";
						var length = Math.max(obj.results.length,5);
						for(var i=0; i<length; i++){
							text+= "" + (i+1) + ". " + obj.results[i].name + "- Address: "+obj.results[i].formatted_address+"\n";
						}
						text+="To get directions, text \'Directions\' and the corresponding number."
						var resultCache = results.slice(0,5);
						value.resultCache=resultCache;
						process.redis.client.hmset(request.body.From,value,function(err){});
						twilioClient.sendMessage({
							to: request.body.From,
							from: '+17209614567',
							body: text
						}, function(err, responseData) {

						});
					});
					// nearest shelters call
				} else if(request.body.Body == "Help" || request.body.Body == value.address) {
					// help call if help or put in same address again
					twilioClient.sendMessage({
						to: request.body.From,
						from: '+17209614567',
						body: "Text Food for nearby soup kitchens.\nText Room for nearby shelters."
					}, function(err, responseData) {
						//console.log(err);
					});
				}	else if(request.body.Body.indexOf("Directions") != -1 && request.body.Body.indexOf("ROOM") != -1) {
					// help call if help or put in same address again
					var str = JSON.parse(request.body.Body);
					var text_arr = str.split(" ");
					var num = parseInt(text_arr[text_arr.length - 1]); // Major assuption that number will be last thing in text
					var text = "";
					// Origin lat and long
					var lat1 = value.latitude;
					var lng1 = value.longitude;
					var latlng1 = lat1+","+lng1;
					// destination lat and long
					var lat2 = value.resultsCache[num - 1].geometry.location.lat.toString;
					var lng2 = value.resultsCache[num - 1].geometry.location.lng.toString;
					var latlng2 = lat2+","+lng2;
					gm.directions(latlng1, latlng2, callback, false, 'walking');
					function callback(err, response) {
						console.log(JSON.stringify(response.results));

						if(response.results.length==0){
							twilioClient.sendMessage({
								to: request.body.From,
								from: '+17209614567',
								body: 'Sorry, we couldn\'t find that address. Please try again'
							}, function(err, responseData) {
							//console.log(err);
						});
						} else {
							// directions found
							var steps = ""
							var legs = response.results.routes.legs.length;
							for(var i=0; i<legs; i++){
								var steps = leg[i].length;
								for(var j = 0; j<steps; j++) {
									steps += response.results.routes.legs[i].steps[j].html_instructions.replace(/(<([^>]+)>)/ig,"") + "\n";
								}
							}
							console.log(steps);

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
						}

					}

				}	else if(request.body.Body == "Update") {
					value.updateAddress=true;
					process.redis.client.hmset(request.body.From,value,function(err){});
					twilioClient.sendMessage({
						to: request.body.From,
						from: '+17209614567',
						body: "Text us a new address, or \'Cancel\' to stay with your old one."
					}, function(err, responseData) {
						//console.log(err);
					});

				} else {
					// unrecognized command

				}
			}
		} else {
			console.log('start');
			twilioClient.sendMessage({
				to: request.body.From,
				from: '+17209614567',
				body: 'Welcome to GimmeShelter! To get started, enter your current address.'
			}, function(err, responseData) {
				console.log(err);
				if (!err) {
					process.redis.client.hmset(request.body.From,{"weather":"true"});
	    	// console.log(responseData.from);
	    	// console.log(responseData.body);
	    }
		  });
		}
	});
}

