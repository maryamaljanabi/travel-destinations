var express         = require("express"),
    middleware      = require("../middleware"), 
    NodeGeocoder    = require('node-geocoder'),
    Destination     = require("../models/destination");

var router = express.Router();

var options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
  };
   
var geocoder = NodeGeocoder(options);

//INDEX
router.get("/", function(req, res){
    Destination.find({}, function(err, all_destinations){
        if(err){
            req.flash("error","Failed to retrieve all destinations");
        } else{
            res.render("destinations/index", {destinations: all_destinations});
        }
    });
});

//NEW DESTINATION
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("destinations/new");
});


//CREATE DESTINATION
router.post("/", middleware.isLoggedIn, function(req, res) {
    var newDestination = req.body.destination;
    geocoder.geocode(newDestination.location, function (err, data) {
      if (err || !data.length) {
        console.log(err);
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      newDestination.lat = data[0].latitude;
      newDestination.lng = data[0].longitude;
      Destination.create(newDestination, function(err, createdDestination){
          if(err){
            req.flash("error","Failed to add destination to database");
          } else {
                createdDestination.author.id = req.user._id;
                createdDestination.author.username = req.user.username;
                createdDestination.save();
                res.redirect("/destinations");
          }
      });
    });
  });

//SHOW DESTINATION
router.get("/:id", function(req, res){
    Destination.findById(req.params.id).populate('comments').exec(function(err, foundDestination){
        if(err){
            req.flash("error","Failed to view destination");
        } else{
            res.render("destinations/show", {destination: foundDestination});
        }
    });
});

//EDIT DESTINATION
router.get("/:id/edit", middleware.checkDestinationOwnership, function(req, res){
    Destination.findById(req.params.id, function(err, foundDestination){
        if(err){
            req.flash("error","Destination not found");
            res.redirect("/destinations");
        } else {
            res.render("destinations/edit", {destination: foundDestination});
        } 
    });
});

//UPDATE DESTINATION
router.put("/:id", middleware.checkDestinationOwnership, function(req, res){
    var editedDestination = req.body.destination;
    geocoder.geocode(editedDestination.location, function (err, data) {
      if (err || !data.length) {
        console.log(err);
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
        editedDestination.lat = data[0].latitude;
        editedDestination.lng = data[0].longitude;
        Destination.findByIdAndUpdate(req.params.id, editedDestination, function(err, updatedDestination){
            if(err){
                req.flash("error","Failed to update destination");
                res.redirect("/destinations");
            } else {
                req.flash("success","Destination updated successfully!");
                res.redirect("/destinations/" + req.params.id);
            }
        });
    });
});

//DESTROY DESTINATION
router.delete("/:id", middleware.checkDestinationOwnership, function(req, res){
    Destination.findByIdAndRemove(req.params.id, function(err, deletedDestination){
        if(err){
            req.flash("error","Failed to delete destination");
            res.redirect("/destinations");
        } else {
            req.flash("success","Destination deleted successfully!");
            res.redirect("/destinations");
        }
    });
});

module.exports = router;