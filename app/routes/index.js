
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('notifications', { title: 'Gimme-Shelter' });
};

