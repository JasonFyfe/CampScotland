var express = require('express');
var router = express.Router({ mergeParams: true });
var Campsite = require("../models/campsite");
var Comment = require("../models/comment");

// Comments New
router.get("/new", isLoggedIn, (req, res) => {
    Campsite.findById(req.params.id, (err, campsite) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campsite: campsite });
        }
    });
});

// Comments Create
router.post("/", isLoggedIn, (req, res) => {
    Campsite.findById(req.params.id, (err, campsite) => {
        if (err) {
            console.log(err);
            res.redirect("/campsites");
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campsite.comments.push(comment);
                    campsite.save();
                    res.redirect(`/campsites/${campsite.id}`);
                }
            });
        }
    });
});

// Comments Edit
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { campsite_id: req.params.id, comment: foundComment });
        }
    });
});

// Comments Update
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
    // TODO ESLINT
    // eslint-disable-next-line no-unused-vars
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect(`/campsites/${req.params.id}`);
        }
    });
});

// Comments Destroy
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect(`/campsites/${req.params.id}`);
        }
    });
});

// Middleware
// TODO Refactor to seperate file
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
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

module.exports = router;