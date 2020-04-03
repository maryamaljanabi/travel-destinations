var express         = require("express"),
    middleware      = require("../middleware"), 
    Destination     = require("../models/destination"),
    Comment         = require("../models/comment");
var router = express.Router({mergeParams: true});

//NEW COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res){
    Destination.findById(req.params.id, function(err, foundDestination){
        if(err){
            req.flash("error","Destination not found");
        } else {
            res.render("comments/new", {destination: foundDestination});
        }
    });
});

//CREATE COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
    Destination.findById(req.params.id, function(err, foundDestination){
        if(err){
            req.flash("error","Destination not found");
            res.redirect("/destinations");
        } else {
            Comment.create(req.body.comment, function(err, createdComment){
                if(err){
                    req.flash("error","Failed to create comment");
                } else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundDestination.comments.push(createdComment),
                    foundDestination.save();
                    req.flash("success","Comment addedd successfully!");
                    res.redirect("/destinations/" + req.params.id)
                }
            });
        }
    });
});

//EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error","Comment not found");
            res.redirect("back");
        } else {
            res.render("comments/edit", {destination_id: req.params.id, comment: foundComment});
        }
    });
});

//UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error","Failed to update comment");
            res.redirect("back");
        } else {
            req.flash("success","Comment updated successfully!");
            res.redirect("/destinations/" + req.params.id);
        }
    });
});

//DESTROY COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
        if(err){
            req.flash("error","Failed to delete comment");
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted successfully");
            res.redirect("/destinations/" + req.params.id);
        }
    });
});

module.exports = router;