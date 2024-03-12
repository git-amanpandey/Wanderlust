module.exports.isValid = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You are not Logged-in..! Please login before use");
        res.redirect("/login")
      }else{
        next();
      }
};