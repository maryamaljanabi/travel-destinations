var express = require("express"),
    User = require("../models/user"),
    passport = require("passport");

var router = express.Router();

//HOME PAGE
router.get("/", function(req, res){
    res.render("landing");
});

//REGISTERATION FORM
router.get("/register", function(req, res){
    res.render("register");
});

//SIGN UP
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, regUser){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Registered successfully! Welcome " + req.body.username);
            res.redirect("/destinations");
        });
    });
});

//LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {   
        successRedirect: "/destinations",
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT
router.get("/logout", function(req, res){
    req.flash("success", "Successfully logged out!");
    req.logOut();
    res.redirect("/destinations");
});

module.exports = router;
