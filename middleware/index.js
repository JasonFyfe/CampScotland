var Campsite = require("../models/campsite");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampsiteOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campsite.findById(req.params.id, (err, foundCampsite) => {
            if (err) {
                res.redirect("back");
            } else {
                if (foundCampsite.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;