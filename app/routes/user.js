
/*
 * GET users listing.
 */
 var gm = require('googlemaps');
 var express = require('express');
 var utils = require('./utils');
var passwordHash=require ('password-hash');
exports.list = function(req, res){
  process.redis.client.del("+13038033844");
  process.redis.client.get("+13038033844",function(err,value){
  	console.log(value);
  });
};
exports.add = function(req, res){
	console.log(express.session);
	var hashedPassword = "1"//passwordHash.generate(req.body.password);
	console.log("hi");
	console.log(hashedPassword);
	var obj = {};
	obj.hp = hashedPassword;
 	gm.geocode(req.body.address,function(err,response){
 		obj.address=response.results[0].formatted_address;
		obj.latitude = response.results[0].geometry.location.lat.toString();
		obj.longitude = response.results[0].geometry.location.lng.toString();
		obj.name = req.body.organizationName;
 		process.redis.client.hmset("user:"+req.body.email, obj, function(err,value){
 			req.session.email=req.body.email;
  		console.log(err);
  		res.redirect('/message');
  	});
 	});
};

exports.send = function(req,res){
	var email = req.session.email;
	process.redis.client.hgetall("user:"+req.body.email, function(err,value){
		utils.sendNotification(value.latitude,value.longitude,req.body.mess,value.name,req.body.radius);
  	console.log(err);
  });
}
exports.login = function(req, res){
	console.log(req.body.password1);
	//console.log(passwordHash.verify(req.body.password1, hashedPassword));
  process.redis.client.get("user:"+req.body.email1, function(err,value){
  	if(passwordHash.verify(req.body.password1, value)){
  		console.log("verified");
  		req.session.email=req.body.email1;
  		res.redirect('/message');
  	}
  	console.log(err);
  });
};
exports.message = function(req,res){
	res.render('messageForm',{title:'GimmeShelter'});
}

