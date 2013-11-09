
/*
 * GET users listing.
 */
 var express = require('express');
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
  process.redis.client.set("user:"+req.body.email, hashedPassword, function(err,value){
  	console.log(err);
  });
    process.redis.client.get("user:facer@gmail.com",function(err,value){
    	console.log('hey');
  	console.log(value);
  });
};
exports.login = function(req, res){
	console.log(req.body.password1);
	console.log(req.body.email);
	console.log("hi");
	//console.log(passwordHash.verify(req.body.password1, hashedPassword));
  process.redis.client.get("user:"+req.body.email1, function(err,value){
  	console.log("hey");
  	if(passwordHash.verify(req.body.password1, value)){
  		console.log("verified");
  		express.session.secret=req.body.email1;
  		console.log(express.session.secret);

  	}
  	console.log(err);
  });
    process.redis.client.get("user:facer@gmail.com",function(err,value){
    	console.log('hey');
  	console.log(value);
  });
};

