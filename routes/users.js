var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Campsite = require('../models/campsite');
var middleware = require('../middleware');

// INDEX ROUTE
router.get("/", (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("users/index", { users: users });
        }
    });
});

// Show Route
router.get("/:id", (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            req.flash('error', "User not found");
            res.redirect("back");
        } else {
            Campsite.find().where('author.id').equals(foundUser._id).exec((err, campsites) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render("users/show", { user: foundUser, campsites: campsites });
                }
            });
        }
    });
});

// EDIT FORM
router.get("/:id/edit", middleware.checkProfileOwnership, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            req.flash("error", "User not found");
        }
        res.render("users/edit", { user: foundUser });
    });
});

module.exports = router;