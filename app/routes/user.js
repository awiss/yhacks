
/*
 * GET users listing.
 */

exports.list = function(req, res){
  process.redis.client.del("+13038033844");
  process.redis.client.get("+13038033844",function(err,value){
  	console.log(value);
  });
};
