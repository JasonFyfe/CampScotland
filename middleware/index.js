var Campsite = require("../models/campsite");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampsiteOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campsite.findById(req.params.id, (err, foundCampsite) => {
            if (err) {
                req.flash("error", "Campsite was not found.");
                res.redirect("back");
            } else {
                if (foundCampsite.author.id.equals(req.user._id)  || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You do not own this Campsite.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)  || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You are not the author of this comment.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;