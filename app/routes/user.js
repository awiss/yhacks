
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
	var hashedPassword = passwordHash.generate(req.body.password);
	console.log("hi");
	console.log(hashedPassword);
	var obj = {};
	obj.hp = hashedPassword;
 	gm.geocode(req.body.address,function(err,response){
 		obj.address=response.results[0].formatted_address;
		obj.latitude = response.results[0].geometry.location.lat.toString();
		obj.longitude = response.results[0].geometry.location.lng.toString();
		obj.orgname = req.body.organizationName;
		console.log(req.body.organizationName);
		console.log('Setting '+"user:"+req.body.email+ " to "+JSON.stringify(obj));
 		process.redis.client.hmset("user:"+req.body.email, obj, function(err,value){
 			req.session.email=req.body.email;
  		console.log(err);
  		res.redirect('/message');
  	});
 	});
};

exports.send = function(req,res){
	var email = req.session.email;
	console.log(email);
	process.redis.client.hgetall("user:"+email, function(err,value){
		utils.sendNotification(value.latitude,value.longitude,req.body.message,value.orgname,parseInt(req.body.radius));
  	console.log(err);
  });
}
exports.login = function(req, res){
	console.log(req.body.password1);
	console.log(req.body.email1);
	//console.log(passwordHash.verify(req.body.password1, hashedPassword));
  process.redis.client.hgetall("user:"+req.body.email1, function(err,value){
  	if(passwordHash.verify(req.body.password1, value.hp)){
  		console.log("verified");
  		express.session.secret=req.body.email1;
  		console.log(express.session.secret);
  		req.session.email=req.body.email1;
  		res.redirect('/message');
  	}
  	if(err){
  		console.log(err);
  		res.end();
  	}
  	
  });
};
exports.message = function(req,res){
	res.render('messageForm',{title:'GimmeShelter'});
}
exports.signup = function(req,res){
	res.render('signUp',{title:'GimmeShelter'});
}
exports.loggingIn = function(req,res){
	res.render('form',{title:'GimmeShelter'});
}

