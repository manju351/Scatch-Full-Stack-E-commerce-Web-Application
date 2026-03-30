const userModel= require('../models/user-model');
module.exports= function(req,res,next){
    if(!req.user) {
        return res.redirect('/');
    }
    if(req.user.role !=="admin"){
        return res.status(403).render('403');
    }
    next();
}