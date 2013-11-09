var gm = require('googlemaps');
var twilioClient = require('twilio')('ACcf46cc45dfc6c558215e76d503ee76de','ebdfcae31d9493e4859d3b80c2b2672b');
exports.sendNotification = function(lat, log, message, org, radius){
	var latlong1 = lat + "," + log;
	console.log('sendNotification');
	process.redis.client.keys('*', function (err, all_keys) {
		all_keys.forEach(function(key,pos){
			console.log(key);
			if(/\d\d\d/.test(key)){
				console.log('there');
				process.redis.client.hgetall(key,function(err,obj){
					console.log(JSON.stringify(obj));
					if(typeof obj.latitude!='undefined' && typeof obj.longitude!='undefined'){
						console.log('here');
						var latlong2 = obj.latitude + "," + obj.longitude;
						gm.distance(latlong1,latlong2,function(err,result){
							console.log(JSON.stringify(result.rows));
							var dist = result.rows[0].elements[0].distance.value/1609.34;
							console.log(result.rows[0].elements[0].distance.value);
							console.log(dist);
							console.log(radius);
							console.log(typeof radius);
							if(dist<radius){
								var mess = org  + " would like to let you know that: " + message;
								twilioClient.sendMessage({
									to: key,
									from: '+17209614567',
									body: mess
								}, function(err,response){
									if(err) throw err;
								});
							}
						});
					}
				});
			}
		});
	});
};
