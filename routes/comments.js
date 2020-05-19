var express = require('express');
var router = express.Router({mergeParams: true});
var Campsite = require("../models/campsite");
var Comment = require("../models/comment");

// Comments New
router.get("/new", isLoggedIn, (req, res) => {
    Campsite.findById(req.params.id, (err, campsite) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campsite: campsite});
        }
    });
});

// Comments Create
router.post("/", isLoggedIn, (req, res) => {
    Campsite.findById(req.params.id, (err, campsite) => {
        if(err){
            console.log(err);
            res.redirect("/campsites");
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                } else {
                    campsite.comments.push(comment);
                    campsite.save();
                    res.redirect(`/campsites/${campsite.id}`);
                }
            });
        }
    });
});

// Middleware
// TODO Refactor to seperate file
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;