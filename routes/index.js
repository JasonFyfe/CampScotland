var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Root route
router.get("/", (req, res) => {
    res.render("landing");
});

// Register Form
router.get("/register", (req, res) => {
    res.render("auth/register");
});
// Register POST route
router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    // TODO ESLINT
    // eslint-disable-next-line no-unused-vars
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("error", "Welcome to Camp Scotland, " + user.username + "!");
            res.redirect("/campsites");
        });
    });
});

// Login Form
router.get("/login", (req, res) => {
    res.render("auth/login");
});
// Login POST route
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campsites",
        failureRedirect: "/login",
        failureFlash: true
    })
);

// Logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campsites");
});

module.exports = router;